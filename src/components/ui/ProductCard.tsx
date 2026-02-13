import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Product } from "@/types/database";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.etsy_url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-700">
          {product.title}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-gray-900">
            ${product.price}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-700">
            Shop on Etsy <ExternalLink size={12} />
          </span>
        </div>
        {product.category && (
          <span className="mt-2 badge w-fit">{product.category}</span>
        )}
      </div>
    </a>
  );
}
