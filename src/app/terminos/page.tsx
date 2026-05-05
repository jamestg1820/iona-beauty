import Link from 'next/link';

export default function TerminosPage() {
  return (
    <div className="bg-white min-h-screen py-20 px-4 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Términos y Condiciones</h1>
        
        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          <p className="font-medium text-gray-900 italic">Última actualización: Mayo 2026</p>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introducción</h2>
            <p>
              Bienvenido a IONA BEAUTY. Al acceder y utilizar nuestro sitio web, usted acepta cumplir con los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Uso del Sitio</h2>
            <p>
              El contenido de este sitio es para su información general y uso personal. Está sujeto a cambios sin previo aviso. Queda prohibido el uso no autorizado de este sitio web, lo cual puede dar lugar a una reclamación por daños y perjuicios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Productos y Precios</h2>
            <p>
              Todos los productos mostrados en IONA BEAUTY están sujetos a disponibilidad. Nos reservamos el derecho de modificar los precios y las descripciones de los productos en cualquier momento. Los precios están expresados en Pesos Colombianos (COP) e incluyen los impuestos aplicables según la ley vigente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Envíos y Pagos</h2>
            <p>
              Ofrecemos el servicio de Pago Contra Entrega. El cliente se compromete a tener el dinero en efectivo disponible al momento de la entrega. El incumplimiento en la recepción del pedido podrá acarrear la restricción de futuros pedidos bajo esta modalidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Propiedad Intelectual</h2>
            <p>
              Este sitio web contiene material que es propiedad de IONA BEAUTY o está licenciado a nosotros. Este material incluye, pero no se limita a, el diseño, la apariencia y los gráficos. La reproducción está prohibida salvo de conformidad con el aviso de copyright.
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
