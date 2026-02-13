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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container-page relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Justin Sobojinski
              <span className="block text-brand-200">Golf</span>
            </h1>
            <p className="mt-6 text-lg text-brand-100 sm:text-xl">
              Golf gear reviews, custom Etsy products, simulator setups, and
              everything you need to elevate your game.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={SOCIAL_LINKS.etsy}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-800 shadow-sm transition-colors hover:bg-brand-50"
              >
                <ShoppingBag size={16} /> Shop Etsy
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-500"
              >
                <Youtube size={16} /> Watch YouTube
              </a>
              <Link
                href="/whats-in-my-bag"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Briefcase size={16} /> What&apos;s In My Bag
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Tag size={16} /> Affiliate Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-page py-16 sm:py-20">
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
          <div className="mt-8 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              Products will appear here once added in the admin dashboard.
            </p>
          </div>
        )}
      </section>

      {/* Latest Videos */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            title="Latest Videos"
            subtitle="New uploads from my YouTube channel"
            href="/videos"
            linkText="View All Videos"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          {latestVideos.length === 0 && (
            <div className="mt-8 rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
              <Youtube className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                Videos will appear here once the YouTube sync is configured.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="container-page py-16 sm:py-20">
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
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-700">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                Read More <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
