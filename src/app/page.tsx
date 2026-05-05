import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCarousel from "@/components/ProductCarousel";
import { getProducts, getCollectionProducts } from "@/lib/shopify";

export default async function Home() {
  const shopifyProducts = await getProducts();
  const recommendedResults = await getCollectionProducts('frontpage');
  const recommendedProducts = recommendedResults.products;

  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <ProductCarousel title="NUEVA COLECCIÓN" products={shopifyProducts.length > 0 ? shopifyProducts : undefined} />
      
      {/* Banner Secundario */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative w-full h-[300px] md:h-[400px] bg-[#1E1E1E] rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80" alt="Cuidado Natural" className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative z-10 text-center text-white px-4 mt-16 md:mt-0">
              <h2 className="text-4xl md:text-5xl font-heading mb-4 tracking-tight text-white uppercase">CUIDADO NATURAL</h2>
              <p className="text-lg md:text-xl mb-8 max-w-lg mx-auto text-gray-200 font-medium">Siente la pureza de la naturaleza en tu piel con los productos premium de IONA BEAUTY.</p>
              <a href="/coleccion/cuidado-facial" className="bg-secondary text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors inline-block text-sm shadow-md uppercase tracking-widest">
                VER CUIDADO FACIAL
              </a>
            </div>
          </div>
        </div>
      </section>

      <ProductCarousel 
        title="RECOMENDADOS PARA TI" 
        products={recommendedProducts.length > 0 ? recommendedProducts : undefined} 
      />
    </>
  );
}
