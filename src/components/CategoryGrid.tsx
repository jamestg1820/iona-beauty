import Link from 'next/link';
import { getCollections } from '@/lib/shopify';

export default async function CategoryGrid() {
  const collections = await getCollections();

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-accent-beige/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 uppercase">
            EXPLORA POR CATEGORÍA
          </h2>
          <Link href="/coleccion/todos-los-productos" className="hidden md:block font-bold text-gray-400 hover:text-secondary hover:underline">
            Ver todo
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {collections.map((collection: any) => (
            <Link key={collection.id} href={`/coleccion/${collection.handle}`} className="group flex flex-col items-center text-center">
              <div className="w-full aspect-square rounded-full overflow-hidden mb-4 border-2 border-white shadow-sm group-hover:border-secondary group-hover:shadow-md transition-all duration-300 relative">
                <img 
                  src={collection.image} 
                  alt={collection.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="font-bold text-gray-800 group-hover:text-secondary transition-colors text-sm md:text-base uppercase tracking-tight">
                {collection.title}
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/coleccion/todos-los-productos" className="font-bold text-gray-500 hover:underline">
            Ver todo
          </Link>
        </div>
      </div>
    </section>
  );
}
