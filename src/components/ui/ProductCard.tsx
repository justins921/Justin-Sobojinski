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
      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: "#f5f5f7" }}
      >
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: 1.47,
            letterSpacing: "-0.374px",
            color: "#1d1d1f",
          }}
        >
          {product.title}
        </h3>
        {product.description && (
          <p
            className="mt-1 line-clamp-2"
            style={{
              fontSize: "14px",
              lineHeight: 1.43,
              letterSpacing: "-0.224px",
              color: "#7a7a7a",
            }}
          >
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span
            style={{
              fontSize: "17px",
              fontWeight: 400,
              color: "#1d1d1f",
            }}
          >
            ${product.price}
          </span>
          <span
            className="inline-flex items-center gap-1"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#0066cc",
            }}
          >
            Shop on Etsy <ExternalLink size={12} />
          </span>
        </div>
        {product.category && (
          <span className="badge mt-2 w-fit">{product.category}</span>
        )}
      </div>
    </a>
  );
}
