import { getProducts } from "@/lib/store";
import ProductCard from "./components/ProductCard";

export const dynamic = "force-dynamic";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50588888888";

export default async function Home() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  const heroMessage = encodeURIComponent("Hola Ale! Quiero ver tu catálogo de ropa 🛍️");

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="font-serif-brand text-2xl md:text-[28px] tracking-tight">
            Fashion Ale
          </h1>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${heroMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-[var(--wine)] text-[var(--cream)] px-4 py-2 hover:bg-[var(--wine-dark)] transition-colors"
          >
            Escríbeme
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-14">
        <p className="text-[var(--wine)] text-sm mb-3">Toda clase de ropa para ti</p>
        <h2 className="font-serif-brand text-4xl md:text-6xl leading-[1.05] max-w-xl mb-5">
          Vístete con lo que te hace sentir vos misma
        </h2>
        <p className="text-[var(--ink)]/70 max-w-md text-[15px] leading-relaxed">
          Cada pieza es única y en poca cantidad. Escoge lo que te guste y
          resérvalo directo por WhatsApp — te respondo yo misma.
        </p>
      </section>

      {/* Catálogo */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {products.length === 0 ? (
          <div className="border border-dashed border-[var(--line)] py-24 text-center">
            <p className="font-serif-brand text-xl mb-2">Catálogo en camino</p>
            <p className="text-[var(--ink)]/60 text-sm">
              Pronto vas a ver aquí toda la ropa disponible.
            </p>
          </div>
        ) : (
          <>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-3 py-1.5 border border-[var(--line)] text-[var(--ink)]/70"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[var(--ink)]/60">
          <p>Fashion Ale · Reservas por WhatsApp</p>
          <a href="/admin" className="hover:text-[var(--ink)] transition-colors">
            Panel de administrador
          </a>
        </div>
      </footer>
    </main>
  );
}
