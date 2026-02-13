import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Tag, Copy } from "lucide-react";
import { getAffiliateLinks, getAffiliateCategories } from "@/lib/data";
import type { AffiliateLink } from "@/types/database";

export const metadata: Metadata = {
  title: "Deals & Affiliate Links",
  description:
    "Golf gear deals and affiliate links — products Justin Sobojinski personally uses and recommends.",
};

function DealCard({ link }: { link: AffiliateLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group flex flex-col"
    >
      {link.image_url && (
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <Image
            src={link.image_url}
            alt={link.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span className="badge mb-2 w-fit">{link.category}</span>
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-700">
          {link.title}
        </h3>
        {link.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {link.description}
          </p>
        )}
        {link.discount_code && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-brand-300 bg-brand-50 p-2.5">
            <Copy size={14} className="shrink-0 text-brand-700" />
            <div>
              <p className="text-xs text-brand-600">{link.discount_text || "Use code"}</p>
              <p className="font-mono text-sm font-bold text-brand-800">
                {link.discount_code}
              </p>
            </div>
          </div>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-brand-700">
          Get Deal <ExternalLink size={14} />
        </span>
      </div>
    </a>
  );
}

export default async function DealsPage() {
  const [links, categories] = await Promise.all([
    getAffiliateLinks(),
    getAffiliateCategories(),
  ]);

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Deals & Recommended Gear
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Products I personally use and recommend. Some links may be affiliate
          links.
        </p>
      </div>

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

      {links.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <DealCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <Tag className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Deals Coming Soon
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Affiliate links and gear recommendations will appear here.
          </p>
        </div>
      )}

      <div className="mt-12 rounded-lg bg-gray-50 p-6 text-center">
        <p className="text-xs text-gray-400">
          Disclosure: Some links on this page are affiliate links. I may earn a
          small commission at no extra cost to you if you make a purchase through
          these links. I only recommend products I personally use and trust.
        </p>
      </div>
    </div>
  );
}
