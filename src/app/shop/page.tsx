import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse custom golf accessories, ball markers, and more from Justin Sobojinski's Etsy shop.",
};

export default async function ShopPage() {
  const products = await getProducts();

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="container-page py-12 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shop
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Custom golf accessories, handcrafted and available on Etsy.
        </p>
      </div>

      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <span className="badge bg-brand-700 text-white">All</span>
          {categories.map((cat) => (
            <span key={cat} className="badge cursor-pointer hover:bg-brand-200">
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Products Coming Soon
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Check back soon or visit my Etsy shop directly.
          </p>
          <a
            href="https://www.etsy.com/shop/JustinSobojinskiGolf"
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
