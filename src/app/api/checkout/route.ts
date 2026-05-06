import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, shippingAddress, note } = body;

    let domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim() || '';
    // Limpiar el dominio de protocolos y barras diagonales
    domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();

    if (!clientId || !clientSecret || !domain) {
      return NextResponse.json({ error: 'Faltan credenciales (ID/Secret/Domain) en Vercel' }, { status: 500 });
    }

    // 1. Obtener token dinámico de Shopify
    const tokenResponse = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
    });

    const tokenText = await tokenResponse.text();
    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error("Shopify no devolvió JSON:", tokenText);
      return NextResponse.json({ 
        error: 'Shopify no respondió en formato JSON', 
        details: tokenText.substring(0, 200),
        domain: domain
      }, { status: 500 });
    }
    
    if (!tokenResponse.ok) {
      console.error("Error de autenticación Shopify:", tokenData);
      return NextResponse.json({ 
        error: `Error de autenticación Shopify (${tokenResponse.status})`,
        details: tokenData 
      }, { status: tokenResponse.status });
    }

    const adminToken = tokenData.access_token;

    // 2. Separar nombre completo en firstName y lastName para Shopify
    const nameParts = (customer.fullName || customer.firstName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Headless';

    // Asegurar formato de teléfono E.164 (Ej: +57...)
    const rawPhone = (customer.phone || '').toString().trim();
    const formattedPhone = rawPhone.startsWith('+') ? rawPhone : (rawPhone ? `+57${rawPhone}` : undefined);

    // 3. Construir los line items para la orden
    const lineItems = items.map((item: any) => {
      const idStr = item.product.variantId?.toString() || item.product.id?.toString() || '';
      const variantIdMatch = idStr.match(/\d+$/);
      const variantId = variantIdMatch ? parseInt(variantIdMatch[0], 10) : null;

      return {
        variant_id: variantId,
        quantity: item.quantity
      };
    });

    // 4. Crear el payload de la orden para la API REST de Shopify
    const orderPayload: any = {
      order: {
        line_items: lineItems,
        // ✅ Cliente con nombre (aparece en sección "Cliente" de Shopify)
        customer: {
          first_name: firstName,
          last_name: lastName,
          phone: formattedPhone,
        },
        // ✅ Teléfono a nivel de orden
        phone: formattedPhone,
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address1: shippingAddress.address1,
          address2: shippingAddress.neighborhood || '', // ✅ Barrio en campo correcto
          city: shippingAddress.city,
          province: shippingAddress.province, // Departamento
          country: 'CO',
          phone: formattedPhone,
        },
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          address1: shippingAddress.address1,
          address2: shippingAddress.neighborhood || '',
          city: shippingAddress.city,
          province: shippingAddress.province,
          country: 'CO',
          phone: formattedPhone
        },
        financial_status: "pending",
        payment_gateway_names: ["Pago Contra Entrega"],
        note: note || "",
        tags: "pago-contra-entrega, creado-headless"
      }
    };

    if (customer.email) {
      orderPayload.order.email = customer.email;
    }

    // 3. Hacer la petición a Shopify Admin API
    const response = await fetch(`https://${domain}/admin/api/2024-01/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ERROR SHOPIFY ADMIN API:", response.status, data);
      return NextResponse.json({ 
        error: `Error de Shopify (${response.status}): ${JSON.stringify(data.errors || data)}`,
        debug_domain: domain
      }, { status: response.status });
    }

    // 🚀 4. ENVIAR A FACEBOOK CONVERSIONS API (CAPI)
    try {
      const accessToken = process.env.FB_ACCESS_TOKEN;
      const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || ''; // Tu ID de Píxel

      if (accessToken) {
        // Función simple para hash SHA256 (Meta lo requiere para privacidad)
        const crypto = require('crypto');
        const hash = (val: string) => val ? crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex') : null;

        // external_id consistente: email si existe, sino fbp, sino IP+UA
        const externalIdRaw = customer.email || body.fbp || `${request.headers.get('x-forwarded-for')?.split(',')[0]}_${request.headers.get('user-agent')}`;
        const externalIdHashed = hash(externalIdRaw || 'guest');

        const fbPayload = {
          data: [{
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            event_id: body.eventId, // MISMO ID DEL CLIENTE PARA DEDUPLICACIÓN
            action_source: 'website',
            event_source_url: body.sourceUrl || `https://${request.headers.get('host')}/checkout`, // URL del navegador
              user_data: {
                em: customer.email ? [hash(customer.email)] : undefined,
                ph: customer.phone ? [hash(customer.phone)] : undefined,
                fn: [hash(firstName)],
                ln: [hash(lastName)],
                ct: shippingAddress.city ? [hash(shippingAddress.city)] : undefined,
                st: shippingAddress.province ? [hash(shippingAddress.province)] : undefined,
                zp: shippingAddress.zip ? [hash(shippingAddress.zip)] : undefined,
                country: [hash('co')],
                external_id: externalIdHashed ? [externalIdHashed] : undefined, // ID Externo consistente
                client_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
                client_user_agent: request.headers.get('user-agent') || '',
                fbp: body.fbp || undefined, // Browser ID
                fbc: body.fbc || undefined, // Click ID
              },
            custom_data: {
              value: items.reduce((total: number, item: any) => total + (item.product.price * item.quantity), 0),
              currency: 'COP',
              content_type: 'product',
              content_ids: items.map((item: any) => item.product.id),
              num_items: items.reduce((total: number, item: any) => total + item.quantity, 0)
            }
          }],
          test_event_code: 'TEST89490'
        };

        const fbResponse = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fbPayload)
        });
        const fbResult = await fbResponse.json();
        console.log(`[CAPI DEBUG] Event: Purchase, Pixel: ${pixelId}, Status: ${fbResponse.status}`, fbResult);
      }
    } catch (fbError) {
      console.error("Error enviando a Facebook CAPI:", fbError);
      // No bloqueamos el éxito de la orden si falla Facebook
    }

    return NextResponse.json({ success: true, orderId: data.order.id });
    
  } catch (error) {
    console.error('Error procesando checkout:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
