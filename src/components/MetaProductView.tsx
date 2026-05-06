'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { buildClientData } from '@/lib/fbHelpers';

interface MetaProductViewProps {
  product: {
    id: string;
    title: string;
    price: number;
  };
}

export default function MetaProductView({ product }: MetaProductViewProps) {
  useEffect(() => {
    const eventId = `vc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 0. Envío a Google Analytics 4 (Navegador)
    sendGAEvent('event', 'view_item', {
      currency: 'COP',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          price: product.price,
          quantity: 1
        }
      ]
    });

    // 1. Envío al Píxel (Navegador)
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.title,
        content_type: 'product',
        value: product.price,
        currency: 'COP'
      }, { eventID: eventId });
    }

    // 2. Envío a CAPI (Servidor) — incluye external_id para mejor coincidencia
    const sendCAPI = async () => {
      try {
        await fetch('/api/meta-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'ViewContent',
            eventId: eventId,
            sourceUrl: window.location.href,
            clientData: buildClientData(),
            customData: {
              content_ids: [product.id],
              content_name: product.title,
              content_type: 'product',
              value: product.price,
              currency: 'COP'
            }
          })
        });
      } catch (err) {
        console.error('CAPI Error:', err);
      }
    };

    sendCAPI();
  }, [product.id, product.title, product.price]);

  return null; // Este componente no renderiza nada, solo rastrea
}
