import type { Product } from "@/lib/types";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50588888888";

export default function ProductCard({ product }: { product: Product }) {
  const message = encodeURIComponent(
    `Hola Ale! Me interesa reservar: ${product.name} (C$${product.price}). ¿Está disponible?`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--line)] mb-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--ink)]/30 text-sm">
            Sin imagen
          </div>
        )}
        {!product.available && (
          <div className="absolute top-3 left-3 bg-[var(--ink)] text-[var(--cream)] text-xs px-3 py-1 tracking-wide">
            Reservado
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 px-0.5">
        <p className="text-xs tracking-wide text-[var(--wine)]">{product.category}</p>
        <h3 className="font-serif-brand text-lg leading-snug">{product.name}</h3>
        <p className="text-[15px] text-[var(--ink)]/70 mb-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="font-medium text-[17px]">C${product.price}</span>
          {product.available && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--wine)] hover:text-[var(--wine-dark)] underline underline-offset-4 decoration-[var(--wine)]/40"
            >
              Reservar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
