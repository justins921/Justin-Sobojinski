import type {
  Product,
  Video,
  ContentPage,
  ContentBlock,
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

const PLACEHOLDER_PAGES: Record<string, { title: string; description: string; content: ContentBlock[] }> = {
  "golf-simulator-setup": {
    title: "Golf Simulator Setup",
    description: "Everything about my home golf simulator setup — hardware, software, and recommendations.",
    content: [
      { type: "callout", emoji: "💡", title: "", text: "I need everything to be easy to setup and store away because my garage is used for golf simulator, woodworking, park Amanda\u0027s car, party room, and movie watching.", variant: "tip" },
      { type: "heading", level: 2, text: "Screen" },
      { type: "paragraph", text: "<a href=\"https://shop.carlofet.com/golf-impact-screens\" target=\"_blank\" rel=\"noopener noreferrer\">Carl\u0027s Place Premium Impact Screen</a>" },
      { type: "callout", emoji: "📌", title: "", text: "Feel free to use my affiliate link with Play Better to purchase any Screen that works for you! <a href=\"https://www.playbetter.com/justin-sobojinski\" target=\"_blank\" rel=\"noopener noreferrer\">playbetter.com/justin-sobojinski</a>", variant: "info" },
      { type: "heading", level: 2, text: "How I Attach Screen to Screen Motor" },
      { type: "paragraph", text: "<a href=\"https://www.amazon.com/gp/product/B09B73TX2N\" target=\"_blank\" rel=\"noopener noreferrer\">Ball Bungee Cords</a>" },
      { type: "heading", level: 2, text: "Screen Motor" },
      { type: "paragraph", text: "<a href=\"https://www.metechs.com/store/index.php?main_page=product_info&products_id=416635\" target=\"_blank\" rel=\"noopener noreferrer\">METechs Large Heavy Duty DIY Retractable Golf Impact Screen Drive</a>" },
      { type: "heading", level: 2, text: "Under Screen Protection" },
      { type: "paragraph", text: "<a href=\"https://www.amazon.com/dp/B0CM8Y9NTP\" target=\"_blank\" rel=\"noopener noreferrer\">Wedge Pillow</a>" },
      { type: "callout", emoji: "⚠️", title: "", text: "No longer needed or used because I got a bigger screen", variant: "warning" },
      { type: "heading", level: 2, text: "Hitting Mat" },
      { type: "paragraph", text: "Switched to <a href=\"https://shop.carlofet.com/carls-hotshot-golf-mat-system\" target=\"_blank\" rel=\"noopener noreferrer\">Carl\u0027s Place HotShot Hitting Mat with Foam Divot Strip</a>" },
      { type: "paragraph", text: "Started with <a href=\"https://www.safeplaygolf.com/Driving-Range-Mats.html\" target=\"_blank\" rel=\"noopener noreferrer\">Monster Mat</a>" },
      { type: "callout", emoji: "📌", title: "", text: "Feel free to use my affiliate link with Play Better to purchase any Hitting Mat that works for you! <a href=\"https://www.playbetter.com/justin-sobojinski\" target=\"_blank\" rel=\"noopener noreferrer\">playbetter.com/justin-sobojinski</a>", variant: "info" },
      { type: "heading", level: 2, text: "Launch Monitor" },
      { type: "paragraph", text: "<a href=\"https://www.playbetter.com/products/garmin-approach-r50-golf-launch-monitor-simulator\" target=\"_blank\" rel=\"noopener noreferrer\">Garmin R50</a>" },
      { type: "paragraph", text: "<a href=\"https://www.bushnellgolf.com/products/launch-monitors/launch-pro/\" target=\"_blank\" rel=\"noopener noreferrer\">Bushnell Launch Pro</a> - Sold" },
      { type: "paragraph", text: "Flightscope Mevo+ - Sold" },
      { type: "paragraph", text: "Garmin R10 - Returned" },
      { type: "paragraph", text: "SkyTrak - Sold" },
      { type: "callout", emoji: "💡", title: "", text: "Definitely do your research/ask me about launch monitors because there is a lot that goes into it, plus possible additional subscriptions.", variant: "tip" },
      { type: "callout", emoji: "📌", title: "", text: "Feel free to use my affiliate link with Play Better to purchase any Launch Monitor that works for you! <a href=\"https://www.playbetter.com/justin-sobojinski\" target=\"_blank\" rel=\"noopener noreferrer\">playbetter.com/justin-sobojinski</a>", variant: "info" },
      { type: "heading", level: 2, text: "Projector" },
      { type: "paragraph", text: "<a href=\"https://www.bestbuy.com/site/benq-tk700-4k-hdr-gaming-projector-game-modes-low-input-lag-3200-lumens-white/6502603.p?skuId=6502603\" target=\"_blank\" rel=\"noopener noreferrer\">BenQ TK700</a>" },
      { type: "callout", emoji: "💡", title: "", text: "There are probably newer and better ones now", variant: "tip" },
      { type: "callout", emoji: "📌", title: "", text: "Feel free to use my affiliate link with Play Better to purchase any Projector that works for you! <a href=\"https://www.playbetter.com/justin-sobojinski\" target=\"_blank\" rel=\"noopener noreferrer\">playbetter.com/justin-sobojinski</a>", variant: "info" },
      { type: "paragraph", text: "<a href=\"https://www.amazon.com/dp/B0CY4PQKQY\" target=\"_blank\" rel=\"noopener noreferrer\">25\u0027 Optical HDMI Cable</a>" },
      { type: "paragraph", text: "<a href=\"https://www.amazon.com/gp/product/B0CFGPKVZ1?th=1\" target=\"_blank\" rel=\"noopener noreferrer\">Wireless HDMI Transmitter</a>" },
      { type: "callout", emoji: "💡", title: "", text: "I no longer use the wireless transmitter, I was experiencing too many glitches.", variant: "tip" },
      { type: "heading", level: 2, text: "Computer (Most Software Requires a Windows PC)" },
      { type: "paragraph", text: "<a href=\"https://www.bestbuy.com/site/asus-rog-zephyrus-16-fhd-165hz-gaming-laptop-intel-core-i7-16gb-ddr5-memory-nvidia-geforce-rtx-3060-512gb-pcie-4-0-ssd-off-black/6494642.p?skuId=6494642\" target=\"_blank\" rel=\"noopener noreferrer\">ASUS ROG Zephyrus 16\" Gaming Laptop — Intel Core i7, 16GB DDR5, RTX 3060, 512GB SSD</a>" },
      { type: "callout", emoji: "💡", title: "", text: "This is a few years old now, and I wanted a laptop, but make sure you get something with a good graphics card", variant: "tip" },
      { type: "callout", emoji: "📌", title: "", text: "Feel free to use my affiliate link with Play Better to purchase any Computer that works for you! <a href=\"https://www.playbetter.com/justin-sobojinski\" target=\"_blank\" rel=\"noopener noreferrer\">playbetter.com/justin-sobojinski</a>", variant: "info" },
      { type: "heading", level: 2, text: "Side Protection" },
      { type: "paragraph", text: "<a href=\"https://www.amazon.com/dp/B0832JFP5H?th=1\" target=\"_blank\" rel=\"noopener noreferrer\">Flexible Curtain Rails</a>" },
      { type: "paragraph", text: "<a href=\"https://www.amazon.com/dp/B08N1FJYCP\" target=\"_blank\" rel=\"noopener noreferrer\">Room Separating Divider</a>" },
      { type: "heading", level: 2, text: "Flooring" },
      { type: "paragraph", text: "<a href=\"https://primeputt.com/products/golf?variant=43203297476776\" target=\"_blank\" rel=\"noopener noreferrer\">PrimePutt Putting Mat</a>" },
      { type: "paragraph", text: "<a href=\"https://puttout.golf/products/medium-putting-mat?variant=39036085076119\" target=\"_blank\" rel=\"noopener noreferrer\">PuttOut Putting Mat</a>" },
      { type: "callout", emoji: "💡", title: "", text: "I am hoping to update this, but it is what I have for now", variant: "tip" },
      { type: "heading", level: 2, text: "Climate Control" },
      { type: "paragraph", text: "<a href=\"https://www.menards.com/main/heating-cooling/heaters/gas-wall-heaters/dyna-glo-trade-30-000-btu-dual-fuel-vent-free-convection-wall-heater/bf30dtdg-4/p-1559111496867-c-6867.htm\" target=\"_blank\" rel=\"noopener noreferrer\">Dyna-Glo 30,000 BTU Dual-Fuel Vent-Free Convection Wall Heater</a>" },
      { type: "callout", emoji: "💡", title: "", text: "In hindsight it may have been better to choose something that can heat and cool", variant: "tip" },
      { type: "heading", level: 2, text: "Garage Door Opener" },
      { type: "paragraph", text: "<a href=\"https://www.menards.com/main/doors-windows-millwork/garage-doors-openers/garage-door-openers/chamberlain-reg-wall-mount-ultra-quiet-garage-door-opener-with-wi-fi-connection/rjo101/p-1642874293758648-c-12367.htm\" target=\"_blank\" rel=\"noopener noreferrer\">Chamberlain Wall Mount Garage Door Opener</a>" },
      { type: "callout", emoji: "💡", title: "", text: "I changed my garage door opener so that I had more room to swing", variant: "tip" },
      { type: "heading", level: 2, text: "Lighting" },
      { type: "paragraph", text: "<a href=\"https://www.bestbuy.com/site/philips-hue-bluetooth-5-6-high-lumen-recessed-downlight-white-and-color-ambiance/6507698.p?skuId=6507698\" target=\"_blank\" rel=\"noopener noreferrer\">Philips Hue Recessed Downlight</a>" },
      { type: "callout", emoji: "💡", title: "", text: "I chose this lighting because not only can I dim it, and/or change colors, I can also set up a spotlight over the ball", variant: "tip" },
      { type: "heading", level: 2, text: "Software / Subscriptions" },
      { type: "paragraph", text: "Garmin Golf — $10/mo" },
      { type: "paragraph", text: "<a href=\"https://gsprogolf.com/\" target=\"_blank\" rel=\"noopener noreferrer\">GSPro</a> — $250/year" },
    ],
  },
  "whats-in-my-bag": {
    title: "What\u0027s In My Bag",
    description: "A complete breakdown of the golf equipment Justin carries on the course — clubs, balls, accessories, and more.",
    content: [
      // --- Woods ---
      { type: "heading", level: 2, text: "Woods — Titleist GT2" },
      { type: "paragraph", text: "All woods fitted with <strong>Mitsubishi Tensei 1K Blue 55</strong> shafts (Stiff), <strong>Golf Pride MCC White</strong> grips, SureFit setting A2." },
      { type: "table", headers: ["Club", "Loft", "Length"], rows: [
        ["Driver", "10\u00ba", "44.5\u2033"],
        ["3 Wood", "15\u00ba", "42\u2033"],
        ["5 Wood", "18\u00ba", "41\u2033"],
        ["7 Wood", "21\u00ba", "40.5\u2033"],
      ] },
      { type: "divider" },

      // --- Irons ---
      { type: "heading", level: 2, text: "Irons — Mizuno Pro S3" },
      { type: "paragraph", text: "All irons fitted with <strong>Nippon NS Pro 950 GH Neo</strong> shafts (Stiff), <strong>Golf Pride MCC Align</strong> grips, 1\u00ba upright lie angle." },
      { type: "table", headers: ["Club", "Loft", "Length"], rows: [
        ["5 Iron", "27\u00ba", "38.25\u2033"],
        ["6 Iron", "30\u00ba", "37.75\u2033"],
        ["7 Iron", "34\u00ba", "37.25\u2033"],
        ["8 Iron", "38\u00ba", "36.75\u2033"],
        ["9 Iron", "42\u00ba", "36.25\u2033"],
        ["Pitching Wedge", "46\u00ba", "35.75\u2033"],
      ] },
      { type: "divider" },

      // --- Wedges ---
      { type: "heading", level: 2, text: "Wedges — Titleist Vokey SM10" },
      { type: "paragraph", text: "All wedges fitted with <strong>True Temper Dynamic Gold S200 Steel</strong> shafts (Wedge flex), stock grips." },
      { type: "table", headers: ["Club", "Loft", "Bounce", "Grind", "Length"], rows: [
        ["Gap Wedge", "50\u00ba", "12\u00ba", "F", "35.50\u2033"],
        ["Sand Wedge", "54\u00ba", "8\u00ba", "M", "35.25\u2033"],
        ["Lob Wedge", "58\u00ba", "10\u00ba", "S", "35.00\u2033"],
      ] },
      { type: "divider" },

      // --- Putter ---
      { type: "heading", level: 2, text: "Putter" },
      { type: "callout", emoji: "🤣", title: "", text: "See putter list below — who knows what\u0027s in my bag right now!", variant: "tip" },
      { type: "divider" },

      // --- Putters ---
      { type: "heading", level: 2, text: "Putters" },
      { type: "table", headers: ["Putter", "Length", "Lie Angle", "Loft", "Grip"], rows: [
        ["YES! Callie", "34\u2033", "72\u00ba", "3\u00ba", "SuperStroke Pistol Tour"],
        ["2025 Scotty Cameron Studio Style Newport 2", "34\u2033", "70\u00ba", "3.5\u00ba", "Full Contact Slim"],
        ["Scotty Cameron H24 Limited Phantom 9.2", "34.5\u2033", "70\u00ba", "3.5\u00ba", "Full Contact Grip"],
        ["Scotty Cameron Phantom 11R OC", "33.5\u2033", "71.5\u00ba", "4\u00ba", "Full Contact Slim"],
        ["TaylorMade Spider Tour X #3", "34\u2033", "70\u00ba", "3\u00ba", "Super Stroke Pistol GT 1.0"],
        ["Adams Prospect (Left Handed)", "34\u2033", "—", "3\u00ba", "—"],
      ] },
      { type: "divider" },

      // --- Not currently gaming ---
      { type: "heading", level: 2, text: "Other Clubs I Have, Not Currently Gaming" },
      { type: "heading", level: 3, text: "Mini Driver — Titleist GT280" },
      { type: "paragraph", text: "Shaft: Mitsubishi Tensei 1K Blue 55 (Stiff) · Length: 42.5\u2033 · Grip: Golf Pride MCC White · SureFit: A2 · Loft: 13\u00ba" },
      { type: "heading", level: 3, text: "Pitching Wedge — Vokey WedgeWorks 44\u00ba F" },
      { type: "paragraph", text: "Shaft Flex: Wedge · Loft: 44\u00ba · Grind: F" },
      { type: "divider" },

      // --- Other ---
      { type: "heading", level: 2, text: "Other Gear" },
      { type: "table", headers: ["Item", "Details"], rows: [
        ["Balls", "Titleist Pro V1x"],
        ["Tees", "Brentwood 3 1/4\u2033"],
        ["Towel", "Sun Day Red"],
        ["Range Finder", "Precision Pro NX9"],
        ["Brush", "Groove-it Mini G"],
      ] },
    ],
  },
};

export async function getContentPage(
  slug: string
): Promise<ContentPage | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    const placeholder = PLACEHOLDER_PAGES[slug];
    if (placeholder) {
      return {
        id: slug,
        slug,
        title: placeholder.title,
        description: placeholder.description,
        og_image: null,
        content: placeholder.content,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
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
