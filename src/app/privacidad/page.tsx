import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <div className="bg-white min-h-screen py-20 px-4 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Política de Privacidad</h1>
        
        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          <p className="font-medium text-gray-900 italic">Última actualización: Mayo 2026</p>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Recolección de Información</h2>
            <p>
              En IONA BEAUTY, valoramos su privacidad. Recopilamos información personal como nombre, dirección de envío, número de teléfono y correo electrónico únicamente con el propósito de procesar sus pedidos y mejorar su experiencia de compra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Uso de los Datos</h2>
            <p>
              La información recolectada se utiliza para:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Procesar y enviar sus pedidos.</li>
                <li>Contactarlo en caso de novedades con su entrega.</li>
                <li>Enviar promociones y noticias (solo si usted lo autoriza).</li>
                <li>Mejorar nuestro servicio al cliente.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Protección de Información</h2>
            <p>
              Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal. Sus datos personales no serán vendidos, intercambiados ni transferidos a ninguna otra empresa sin su consentimiento, excepto para el propósito expreso de entregar el producto solicitado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
            <p>
              Utilizamos cookies para ayudarnos a recordar y procesar los artículos en su carrito de compras y entender sus preferencias para futuras visitas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Consentimiento</h2>
            <p>
              Al utilizar nuestro sitio, usted acepta nuestra política de privacidad.
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/" className="text-primary font-black tracking-widest text-sm hover:underline uppercase">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
