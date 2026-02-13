import type {
  Product,
  Video,
  ContentPage,
  AffiliateLink,
} from "@/types/database";

// ---------- fallback data (used when Supabase is not configured) ----------

const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Custom Golf Ball Marker",
    description: "Handcrafted brass golf ball marker with personalized engraving.",
    price: "24.99",
    currency: "USD",
    image_url: "/placeholder-product.svg",
    etsy_url: "https://www.etsy.com/shop/JustinSobojinskiGolf",
    category: "Accessories",
    tags: ["marker", "custom", "brass"],
    is_featured: true,
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Golf Divot Repair Tool",
    description: "Premium stainless steel divot repair tool with custom design.",
    price: "19.99",
    currency: "USD",
    image_url: "/placeholder-product.svg",
    etsy_url: "https://www.etsy.com/shop/JustinSobojinskiGolf",
    category: "Accessories",
    tags: ["divot", "tool", "stainless"],
    is_featured: true,
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Golf Towel - Embroidered",
    description: "Premium microfiber golf towel with custom embroidered logo.",
    price: "29.99",
    currency: "USD",
    image_url: "/placeholder-product.svg",
    etsy_url: "https://www.etsy.com/shop/JustinSobojinskiGolf",
    category: "Accessories",
    tags: ["towel", "embroidered", "microfiber"],
    is_featured: true,
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const PLACEHOLDER_VIDEOS: Video[] = [
  {
    id: "1",
    video_id: "dQw4w9WgXcQ",
    title: "My Golf Simulator Setup Tour 2025",
    description: "Full walkthrough of my home golf simulator setup.",
    published_at: new Date().toISOString(),
    thumbnail_url: "/placeholder-video.svg",
    thumbnail_high_url: null,
    duration: "PT12M30S",
    view_count: 15000,
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["simulator", "setup"],
    slug: "golf-simulator-setup-tour-2025",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    video_id: "dQw4w9WgXcQ",
    title: "Best Golf Ball Markers - Full Review",
    description: "Reviewing the best ball markers on the market.",
    published_at: new Date(Date.now() - 86400000).toISOString(),
    thumbnail_url: "/placeholder-video.svg",
    thumbnail_high_url: null,
    duration: "PT8M15S",
    view_count: 8500,
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["review", "accessories"],
    slug: "best-golf-ball-markers-review",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    video_id: "dQw4w9WgXcQ",
    title: "Home Tee Hero Course Play - Pebble Beach",
    description: "Playing Pebble Beach on Home Tee Hero.",
    published_at: new Date(Date.now() - 172800000).toISOString(),
    thumbnail_url: "/placeholder-video.svg",
    thumbnail_high_url: null,
    duration: "PT22M05S",
    view_count: 12000,
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["home-tee-hero", "gameplay"],
    slug: "home-tee-hero-pebble-beach",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const PLACEHOLDER_AFFILIATE_LINKS: AffiliateLink[] = [
  {
    id: "1",
    title: "Garmin Approach R10",
    description: "The launch monitor I use in my simulator setup. Great value for home use.",
    url: "#",
    image_url: "/placeholder-product.svg",
    category: "Simulator Equipment",
    discount_code: null,
    discount_text: null,
    is_featured: true,
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Pro V1 Golf Balls (Dozen)",
    description: "My go-to ball for every round. Can't beat the feel and control.",
    url: "#",
    image_url: "/placeholder-product.svg",
    category: "Golf Balls",
    discount_code: "JUSTIN10",
    discount_text: "10% off with code",
    is_featured: true,
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ---------- data fetching helpers ----------

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  const { createSupabaseServerClient } = await import("@/lib/supabase-server");
  return createSupabaseServerClient();
}

export async function getProducts(featured?: boolean): Promise<Product[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return featured
      ? PLACEHOLDER_PRODUCTS.filter((p) => p.is_featured)
      : PLACEHOLDER_PRODUCTS;
  }
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (featured) query = query.eq("is_featured", true);
  const { data } = await query;
  return (data as Product[]) ?? [];
}

export async function getVideos(options?: {
  featured?: boolean;
  limit?: number;
  search?: string;
}): Promise<Video[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    let result = PLACEHOLDER_VIDEOS;
    if (options?.featured)
      result = result.filter((v) => v.is_featured);
    if (options?.search)
      result = result.filter((v) =>
        v.title.toLowerCase().includes(options.search!.toLowerCase())
      );
    if (options?.limit) result = result.slice(0, options.limit);
    return result;
  }
  let query = supabase
    .from("videos")
    .select("*")
    .order("published_at", { ascending: false });
  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.limit) query = query.limit(options.limit);
  if (options?.search)
    query = query.textSearch("title", options.search, {
      type: "websearch",
    });
  const { data } = await query;
  return (data as Video[]) ?? [];
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return PLACEHOLDER_VIDEOS.find((v) => v.slug === slug) ?? null;
  }
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as Video | null;
}

export async function getContentPage(
  slug: string
): Promise<ContentPage | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return {
      id: slug,
      slug,
      title: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      description: null,
      og_image: null,
      content: [
        {
          type: "callout",
          emoji: "🔧",
          title: "Content Coming Soon",
          text: "This page is editable from the admin dashboard. Connect Supabase and add your content!",
          variant: "info",
        },
      ],
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  const { data } = await supabase
    .from("content_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data as ContentPage | null;
}

export async function getAffiliateLinks(options?: {
  featured?: boolean;
  category?: string;
}): Promise<AffiliateLink[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    let result = PLACEHOLDER_AFFILIATE_LINKS;
    if (options?.featured)
      result = result.filter((l) => l.is_featured);
    if (options?.category)
      result = result.filter((l) => l.category === options.category);
    return result;
  }
  let query = supabase
    .from("affiliate_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.category) query = query.eq("category", options.category);
  const { data } = await query;
  return (data as AffiliateLink[]) ?? [];
}

export async function getAffiliateCategories(): Promise<string[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return [...new Set(PLACEHOLDER_AFFILIATE_LINKS.map((l) => l.category))];
  }
  const { data } = await supabase
    .from("affiliate_links")
    .select("category")
    .eq("is_active", true);
  if (!data) return [];
  return [...new Set(data.map((d: { category: string }) => d.category))];
}
