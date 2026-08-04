import Link from "next/link";
import {
  ShoppingBag,
  Youtube,
  Briefcase,
  Tag,
  ArrowRight,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import VideoCard from "@/components/ui/VideoCard";
import { getProducts, getVideos } from "@/lib/data";
import { SOCIAL_LINKS } from "@/lib/constants";

export default async function HomePage() {
  const [featuredProducts, latestVideos] = await Promise.all([
    getProducts(true),
    getVideos({ limit: 3 }),
  ]);

  return (
    <>
      {/* Hero Section – dark surface */}
      <section style={{ backgroundColor: "#000000" }}>
        <div
          className="container-page text-center"
          style={{ paddingTop: "96px", paddingBottom: "96px" }}
        >
          <h1
            style={{
              fontFamily:
                '"SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: "56px",
              fontWeight: 600,
              lineHeight: 1.07,
              letterSpacing: "-0.28px",
              color: "#ffffff",
            }}
          >
            Justin Sobojinski
          </h1>
          <p
            style={{
              marginTop: "12px",
              fontFamily:
                '"SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: "28px",
              fontWeight: 400,
              lineHeight: 1.14,
              letterSpacing: "0.196px",
              color: "#cccccc",
            }}
          >
            Golf
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={SOCIAL_LINKS.etsy}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ShoppingBag size={16} /> Shop Etsy
            </a>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
              style={{
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Youtube size={16} /> Watch YouTube
            </a>
            <Link
              href="/whats-in-my-bag"
              className="btn-ghost inline-flex items-center gap-2"
              style={{ color: "#2997ff" }}
            >
              <Briefcase size={16} /> What&apos;s In My Bag
            </Link>
            <Link
              href="/deals"
              className="btn-ghost inline-flex items-center gap-2"
              style={{ color: "#2997ff" }}
            >
              <Tag size={16} /> Affiliate Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products – canvas/parchment */}
      <section
        style={{
          backgroundColor: "#f5f5f7",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <div className="container-page">
          <SectionHeader
            title="Featured Products"
            subtitle="Custom golf accessories from my Etsy shop"
            href="/shop"
            linkText="View All Products"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {featuredProducts.length === 0 && (
            <div
              className="mt-8 p-12 text-center"
              style={{
                borderRadius: "18px",
                border: "2px dashed #e0e0e0",
              }}
            >
              <ShoppingBag
                className="mx-auto"
                size={40}
                style={{ color: "#d2d2d7" }}
              />
              <p
                className="mt-3"
                style={{ fontSize: "14px", color: "#7a7a7a" }}
              >
                Products will appear here once added in the admin dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Videos – dark tile */}
      <section style={{ backgroundColor: "#272729", paddingTop: "80px", paddingBottom: "80px" }}>
        <div className="container-page">
          <SectionHeader
            title="Latest Videos"
            subtitle="New uploads from my YouTube channel"
            href="/videos"
            linkText="View All Videos"
            dark
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          {latestVideos.length === 0 && (
            <div
              className="mt-8 p-12 text-center"
              style={{
                borderRadius: "18px",
                border: "2px dashed rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <Youtube
                className="mx-auto"
                size={40}
                style={{ color: "rgba(255, 255, 255, 0.3)" }}
              />
              <p
                className="mt-3"
                style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.5)" }}
              >
                Videos will appear here once the YouTube sync is configured.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Explore – parchment */}
      <section
        style={{
          backgroundColor: "#f5f5f7",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <div className="container-page">
          <SectionHeader title="Explore" subtitle="Dive deeper into golf content" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "What's In My Bag",
                desc: "See every club, ball, and accessory I carry on the course.",
                href: "/whats-in-my-bag",
              },
              {
                title: "Golf Simulator Setup",
                desc: "My full home simulator build — hardware, software, and tips.",
                href: "/golf-simulator-setup",
              },
              {
                title: "Home Tee Hero Course Request",
                desc: "Request a course for me to play on Home Tee Hero!",
                href: "/home-tee-hero-course-request",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card group flex flex-col p-6"
              >
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 600,
                    lineHeight: 1.47,
                    color: "#1d1d1f",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2"
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.43,
                    letterSpacing: "-0.224px",
                    color: "#7a7a7a",
                  }}
                >
                  {item.desc}
                </p>
                <span
                  className="mt-4 inline-flex items-center gap-1"
                  style={{
                    fontSize: "17px",
                    fontWeight: 500,
                    color: "#0066cc",
                  }}
                >
                  Read More <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
