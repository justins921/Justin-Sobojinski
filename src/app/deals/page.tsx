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
        <div
          className="relative aspect-[16/10] overflow-hidden"
          style={{ backgroundColor: "#f5f5f7" }}
        >
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
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: 1.47,
            letterSpacing: "-0.374px",
            color: "#1d1d1f",
          }}
        >
          {link.title}
        </h3>
        {link.description && (
          <p
            className="mt-1 line-clamp-2"
            style={{
              fontSize: "14px",
              lineHeight: 1.43,
              letterSpacing: "-0.224px",
              color: "#7a7a7a",
            }}
          >
            {link.description}
          </p>
        )}
        {link.discount_code && (
          <div
            className="mt-3 flex items-center gap-2"
            style={{
              borderRadius: "11px",
              border: "1px solid #e0e0e0",
              backgroundColor: "#f5f5f7",
              padding: "10px",
            }}
          >
            <Copy size={14} className="shrink-0" style={{ color: "#0066cc" }} />
            <div>
              <p
                style={{
                  fontSize: "12px",
                  letterSpacing: "-0.12px",
                  color: "#7a7a7a",
                }}
              >
                {link.discount_text || "Use code"}
              </p>
              <p
                className="font-mono"
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1d1d1f",
                }}
              >
                {link.discount_code}
              </p>
            </div>
          </div>
        )}
        <span
          className="mt-auto inline-flex items-center gap-1 pt-4"
          style={{
            fontSize: "17px",
            fontWeight: 500,
            color: "#0066cc",
          }}
        >
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
    <div className="container-page" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
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
          Deals & Recommended Gear
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
          Products I personally use and recommend. Some links may be affiliate
          links.
        </p>
      </div>

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

      {links.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <DealCard key={link.id} link={link} />
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
          <Tag className="mx-auto" size={48} style={{ color: "#d2d2d7" }} />
          <h3
            className="mt-4"
            style={{ fontSize: "17px", fontWeight: 600, color: "#1d1d1f" }}
          >
            Deals Coming Soon
          </h3>
          <p
            className="mt-2"
            style={{ fontSize: "14px", color: "#7a7a7a" }}
          >
            Affiliate links and gear recommendations will appear here.
          </p>
        </div>
      )}

      <div
        className="mt-12 p-6 text-center"
        style={{
          borderRadius: "11px",
          backgroundColor: "#f5f5f7",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: 1.43,
            letterSpacing: "-0.12px",
            color: "#7a7a7a",
          }}
        >
          Disclosure: Some links on this page are affiliate links. I may earn a
          small commission at no extra cost to you if you make a purchase through
          these links. I only recommend products I personally use and trust.
        </p>
      </div>
    </div>
  );
}
