import { cache } from "react";
import type {
  Product,
  Video,
  ContentPage,
  ContentBlock,
  AffiliateLink,
} from "@/types/database";
import { CURRENT_PUTTER } from "@/content/current-putter";
import { getChannelVideos } from "@/lib/youtube";

const STATIC_TIMESTAMP = "2026-10-25T12:00:00.000Z";

const BLOCKED_PRODUCT_TITLES = new Set([
  "custom golf ball marker",
  "golf divot repair tool",
  "golf towel - embroidered",
]);

const BLOCKED_DEAL_TITLES = new Set([
  "garmin approach r10",
  "pro v1 golf balls (dozen)",
]);

const BLOCKED_DISCOUNT_CODES = new Set(["JUSTIN10"]);
const BLOCKED_VIDEO_IDS = new Set(["dQw4w9WgXcQ"]);

function isHttpUrl(url: string | null | undefined): url is string {
  return !!url && url !== "#" && /^https?:\/\//i.test(url);
}

// ---------- real catalog (used when Supabase has no rows) ----------

const REAL_PRODUCTS: Product[] = [
  {
    id: "precision-point-original",
    title: "Precision Point Original",
    description:
      "3D-printed alignment marker with an embedded magnet. Seven colors.",
    price: "24.99",
    currency: "USD",
    image_url: "/products/original.jpg",
    etsy_url: "https://www.etsy.com/listing/1534296467",
    category: "Ball Markers",
    tags: ["precision-point", "magnetic"],
    is_featured: true,
    sort_order: 1,
    is_active: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: "precision-point-max",
    title: "Precision Point Max",
    description: "Oversized 3D-printed alignment marker for visibility. Five colors.",
    price: "29.99",
    currency: "USD",
    image_url: "/products/max.jpg",
    etsy_url: "https://www.etsy.com/listing/1885791615",
    category: "Ball Markers",
    tags: ["precision-point", "oversized"],
    is_featured: true,
    sort_order: 2,
    is_active: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: "precision-point-lite",
    title: "Precision Point Lite",
    description: "Compact 3D-printed alignment marker.",
    price: "24.99",
    currency: "USD",
    image_url: "/products/lite.jpg",
    etsy_url: "https://www.etsy.com/listing/1871611142",
    category: "Ball Markers",
    tags: ["precision-point", "compact"],
    is_featured: true,
    sort_order: 3,
    is_active: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: "precision-point-combo",
    title: "Precision Point Combo",
    description: "Original, Max, and Lite together.",
    price: "69.99",
    currency: "USD",
    image_url: "/products/combo.jpg",
    etsy_url: "https://www.etsy.com/listing/4314156548",
    category: "Ball Markers",
    tags: ["precision-point", "bundle"],
    is_featured: true,
    sort_order: 4,
    is_active: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
];

const THESTACK_CODE = "qB0ntj5k54WaZiEIEsiOmvQAXl33";

const REAL_AFFILIATE_LINKS: AffiliateLink[] = [
  {
    id: "playbetter",
    title: "PlayBetter",
    description:
      "Golf tech and training gear I use. Shopping through this link supports the channel.",
    url: "https://www.playbetter.com/justin-sobojinski",
    image_url: null,
    category: "Gear",
    discount_code: null,
    discount_text: null,
    links: null,
    is_featured: true,
    sort_order: 1,
    is_active: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: "golftec",
    title: "GOLFTEC Lessons",
    description:
      "Lessons at GOLFTEC. $100 off with my referral link, and I receive $100 in GOLFTEC credit.",
    url: "https://gt.golf/DSVx5c",
    image_url: null,
    category: "Lessons",
    discount_code: null,
    discount_text: "$100 off",
    links: null,
    is_featured: true,
    sort_order: 2,
    is_active: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: "thestack",
    title: "TheStack",
    description:
      "Speed, wedge, and putting training. $50 off with my code, already applied on these links.",
    url: "https://shop.app/checkout/50449285314/cn/hWN5FckPou7lqdTEc2rj4Szy/en-us/shoppay?_cs=3.AMPS&_r=AQABL66Qm3NCz-GcTRo3cnxHlGS1OTIkto6lkq9dFC5xkLw&cart_link_id=FeH8WPcc&discount_code=qB0ntj5k54WaZiEIEsiOmvQAXl33",
    image_url: null,
    category: "Training",
    discount_code: THESTACK_CODE,
    discount_text: "$50 off with code",
    links: [
      {
        label: "TheStack Speed Trainer",
        url: "https://shop.app/checkout/50449285314/cn/hWN5FckPou7lqdTEc2rj4Szy/en-us/shoppay?_cs=3.AMPS&_r=AQABL66Qm3NCz-GcTRo3cnxHlGS1OTIkto6lkq9dFC5xkLw&cart_link_id=FeH8WPcc&discount_code=qB0ntj5k54WaZiEIEsiOmvQAXl33",
      },
      {
        label: "TheStack + Stack Radar Bundle",
        url: "https://shop.app/checkout/50449285314/cn/hWN5FckPou7lqdTEc2rj4Szy/en-us/shoppay?_cs=3.AMPS&_r=AQAB4G7YO7fqG7ibkwDrKY_GE-OzuZtPdCJSCh2qa-vEGrE&cart_link_id=plcxL6TY&discount_code=qB0ntj5k54WaZiEIEsiOmvQAXl33",
      },
      {
        label: "Junior Stack Speed Trainer",
        url: "https://shop.app/checkout/50449285314/cn/hWN5FckPou7lqdTEc2rj4Szy/en-us/shoppay?_cs=3.AMPS&_r=AQABO6_m8fA9O7Vmv52m_Tc8OKJJYPA9LvZVA7brgIqFhWc&cart_link_id=EoEIhJQ2&discount_code=qB0ntj5k54WaZiEIEsiOmvQAXl33",
      },
      {
        label: "Junior Stack + Radar Bundle",
        url: "https://shop.app/checkout/50449285314/cn/hWN5FckPou7lqdTEc2rj4Szy/en-us/shoppay?_cs=3.AMPS&_r=AQABzt14u2jI9j21g6wvhpFxadizNmKFaEu6xyshjsKA8iY&cart_link_id=8PgHDMMZ&discount_code=qB0ntj5k54WaZiEIEsiOmvQAXl33",
      },
      {
        label: "Stack Radar Only",
        url: "https://shop.app/checkout/50449285314/cn/hWN5FckPou7lqdTEc2rj4Szy/en-us/shoppay?_cs=3.AMPS&_r=AQAB6GrWsBUwn9ndSlfbs2DUtQAjfu6Kj-9wvwRbQbLEHBM&cart_link_id=mjHHOHRx&discount_code=qB0ntj5k54WaZiEIEsiOmvQAXl33",
      },
    ],
    is_featured: true,
    sort_order: 3,
    is_active: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
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

function isRealProduct(product: Product): boolean {
  if (!product.is_active) return false;
  if (BLOCKED_PRODUCT_TITLES.has(product.title.trim().toLowerCase())) return false;
  if (!isHttpUrl(product.etsy_url)) return false;
  if (!product.image_url || product.image_url.includes("placeholder-")) return false;
  return true;
}

const loadProducts = cache(async (): Promise<Product[]> => {
  const supabase = await getSupabaseClient();
  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    const rows = ((data as Product[]) ?? []).filter(isRealProduct);
    if (rows.length > 0) return rows;
  }
  return REAL_PRODUCTS.filter(isRealProduct);
});

export async function getProducts(featured?: boolean): Promise<Product[]> {
  const products = await loadProducts();
  return featured ? products.filter((product) => product.is_featured) : products;
}

export async function getVideos(options?: {
  featured?: boolean;
  limit?: number;
  search?: string;
}): Promise<Video[]> {
  let result = (await getChannelVideos()).filter(
    (video) => !BLOCKED_VIDEO_IDS.has(video.video_id) && isHttpUrl(video.url)
  );
  if (options?.featured) result = result.filter((video) => video.is_featured);
  if (options?.search) {
    const query = options.search.toLowerCase();
    result = result.filter((video) => video.title.toLowerCase().includes(query));
  }
  if (options?.limit) result = result.slice(0, options.limit);
  return result;
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const videos = await getVideos();
  return videos.find((video) => video.slug === slug) ?? null;
}

const STATIC_PAGES: Record<string, { title: string; description: string; content: ContentBlock[] }> = {
  "golf-simulator-setup": {
    title: "Golf Simulator Setup",
    description: "Everything about my home golf simulator setup — hardware, software, and recommendations.",
    content: [
      { type: "callout", emoji: "💡", title: "", text: "I need everything to be easy to set up and store away. The garage is shared — golf simulator, woodworking, a party room, and movies — and the setup stows away.", variant: "tip" },
      { type: "heading", level: 2, text: "Screen" },
      { type: "paragraph", text: "<a href=\"https://shop.carlofet.com/golf-impact-screens\" target=\"_blank\" rel=\"noopener noreferrer\">Carl\u0027s Place Premium Impact Screen</a>" },
      { type: "callout", emoji: "📌", title: "", text: "Feel free to use my affiliate link with Play Better to purchase any Screen that works for you! <a href=\"https://www.playbetter.com/justin-sobojinski\" target=\"_blank\" rel=\"noopener noreferrer\">playbetter.com/justin-sobojinski</a>", variant: "info" },
      { type: "heading", level: 2, text: "How I Attach Screen to Screen Motor" },
      { type: "paragraph", text: "<a href=\"https://www.amazon.com/gp/product/B09B73TX2N\" target=\"_blank\" rel=\"noopener noreferrer\">Ball Bungee Cords</a>" },
      { type: "heading", level: 2, text: "Screen Motor" },
      { type: "paragraph", text: "<a href=\"https://www.metechs.com/store/index.php?main_page=product_info&products_id=416635\" target=\"_blank\" rel=\"noopener noreferrer\">METechs Large Heavy Duty DIY Retractable Golf Impact Screen Drive</a>" },
      { type: "heading", level: 2, text: "Under Screen Protection" },
      { type: "paragraph", text: "<a href=\"https://www.amazon.com/dp/B0CM8Y9NTP\" target=\"_blank\" rel=\"noopener noreferrer\">Wedge Pillow</a>" },
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
      { type: "paragraph", text: "Home Tee Hero" },
    ],
  },
  "whats-in-my-bag": {
    title: "What\u0027s In My Bag",
    description: "A complete breakdown of the golf equipment Justin carries on the course — clubs, balls, accessories, and more.",
    content: [
      { type: "heading", level: 2, text: "Woods — Titleist GT2" },
      { type: "paragraph", text: "SureFit A3. Shafts: <strong>Mitsubishi Tensei 1K Blue 55</strong>, stiff. Built 1 inch short." },
      { type: "table", headers: ["Club", "Loft"], rows: [
        ["Driver", "10°"],
        ["3 Wood", "15°"],
        ["5 Wood", "18°"],
        ["7 Wood", "21°"],
      ] },
      { type: "divider" },

      { type: "heading", level: 2, text: "Irons — Titleist T200" },
      { type: "paragraph", text: "6-iron through pitching wedge. Shafts: <strong>S300 AMT Red</strong>." },
      { type: "divider" },

      { type: "heading", level: 2, text: "Wedges — Titleist Vokey SM10" },
      { type: "table", headers: ["Loft", "Bounce", "Grind"], rows: [
        ["50°", "12°", "F"],
        ["54°", "8°", "M"],
        ["56°", "14°", "F"],
        ["60°", "12°", "D"],
      ] },
      { type: "divider" },

      { type: "heading", level: 2, text: "Putter" },
      { type: "paragraph", text: `<strong>${CURRENT_PUTTER}</strong>` },
      { type: "paragraph", text: "In the bag right now. This one rotates." },
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
        ["Balls", "Titleist Pro V1x Left Dash"],
        ["Tees", "Brentwood 3 1/4\u2033"],
        ["Towel", "Sun Day Red"],
        ["Range Finder", "Precision Pro NX9"],
        ["Brush", "Groove-it Mini G"],
      ] },
    ],
  },
};

function staticContentPage(slug: string): ContentPage | null {
  const page = STATIC_PAGES[slug];
  if (!page) return null;
  return {
    id: slug,
    slug,
    title: page.title,
    description: page.description,
    og_image: null,
    content: page.content,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  };
}

function isPlaceholderContent(page: ContentPage): boolean {
  const text = JSON.stringify(page.content ?? []);
  return text.includes("Connect Supabase") || text.includes("Content Coming Soon");
}

export async function getContentPage(
  slug: string
): Promise<ContentPage | null> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    const { data } = await supabase
      .from("content_pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    const page = data as ContentPage | null;
    if (page && !isPlaceholderContent(page) && page.content?.length) return page;
  }
  return staticContentPage(slug);
}

function sanitizeDeal(link: AffiliateLink): AffiliateLink | null {
  if (!link.is_active) return null;
  if (BLOCKED_DEAL_TITLES.has(link.title.trim().toLowerCase())) return null;
  const code = link.discount_code?.trim().toUpperCase();
  const cleaned: AffiliateLink =
    code && BLOCKED_DISCOUNT_CODES.has(code)
      ? { ...link, discount_code: null, discount_text: null }
      : link;
  const links = (cleaned.links ?? []).filter((item) => isHttpUrl(item.url));
  if (links.length > 0) {
    return {
      ...cleaned,
      links,
      url: isHttpUrl(cleaned.url) ? cleaned.url : links[0].url,
      image_url: cleaned.image_url?.includes("placeholder-") ? null : cleaned.image_url,
    };
  }
  if (!isHttpUrl(cleaned.url)) return null;
  return {
    ...cleaned,
    links: null,
    image_url: cleaned.image_url?.includes("placeholder-") ? null : cleaned.image_url,
  };
}

const loadAffiliateLinks = cache(async (): Promise<AffiliateLink[]> => {
  const supabase = await getSupabaseClient();
  if (supabase) {
    const { data } = await supabase
      .from("affiliate_links")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    const rows = ((data as AffiliateLink[]) ?? []).flatMap((link) => {
      const cleaned = sanitizeDeal(link);
      return cleaned ? [cleaned] : [];
    });
    if (rows.length > 0) return rows;
  }
  return REAL_AFFILIATE_LINKS.flatMap((link) => {
    const cleaned = sanitizeDeal(link);
    return cleaned ? [cleaned] : [];
  });
});

export async function getAffiliateLinks(options?: {
  featured?: boolean;
  category?: string;
}): Promise<AffiliateLink[]> {
  let result = await loadAffiliateLinks();
  if (options?.featured) result = result.filter((link) => link.is_featured);
  if (options?.category) result = result.filter((link) => link.category === options.category);
  return result;
}

export async function getAffiliateCategories(): Promise<string[]> {
  const links = await getAffiliateLinks();
  return [...new Set(links.map((link) => link.category))];
}
