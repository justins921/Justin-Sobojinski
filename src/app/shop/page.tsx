import { ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/data";
import { SOCIAL_LINKS } from "@/lib/constants";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/shop", {
  title: "Shop",
  description:
    "Precision Point ball markers from Justin Sobojinski's Etsy shop.",
});

export default async function ShopPage() {
  const products = await getProducts();

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="container-page" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
      {/* Header */}
      <div className="mb-10">
        <h1
          style={{
            fontFamily:
              '"SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "40px",
            fontWeight: 600,
            lineHeight: 1.1,
            color: "#1d1d1f",
          }}
        >
          Shop
        </h1>
        <p
          className="mt-2"
          style={{
            fontSize: "17px",
            fontWeight: 400,
            lineHeight: 1.47,
            letterSpacing: "-0.374px",
            color: "#7a7a7a",
          }}
        >
          3D-printed Precision Point ball markers, available on Etsy.
        </p>
      </div>

      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <span
            className="inline-flex items-center font-medium cursor-pointer"
            style={{
              fontSize: "12px",
              lineHeight: 1.0,
              letterSpacing: "-0.12px",
              padding: "5px 12px",
              borderRadius: "9999px",
              backgroundColor: "#0066cc",
              color: "#ffffff",
            }}
          >
            All
          </span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center font-medium cursor-pointer"
              style={{
                fontSize: "12px",
                lineHeight: 1.0,
                letterSpacing: "-0.12px",
                padding: "5px 12px",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                color: "#1d1d1f",
                border: "1px solid #e0e0e0",
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div
          className="p-16 text-center"
          style={{
            borderRadius: "18px",
            border: "2px dashed #e0e0e0",
          }}
        >
          <ShoppingBag
            className="mx-auto"
            size={48}
            style={{ color: "#d2d2d7" }}
          />
          <a
            href={SOCIAL_LINKS.etsy}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6"
          >
            Visit Etsy Shop
          </a>
        </div>
      )}
    </div>
  );
}
