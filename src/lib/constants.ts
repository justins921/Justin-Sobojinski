export const SITE_NAME = "Justin Sobojinski Golf";
export const SITE_DESCRIPTION =
  "Golf gear reviews, simulator setups, Etsy products, and more from Justin Sobojinski.";

/** Public origin for metadata, sitemap, and canonical URLs. */
export const SITE_URL = "https://justinsobojinski.com";

export const YOUTUBE_CHANNEL_HANDLE = "@justinsobojinski";
export const YOUTUBE_CHANNEL_ID = "UCmLVyagEBceM14QKyvm2DsA";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@justinsobojinski";

/** Public page Justin already shares for course requests. */
export const COURSE_REQUEST_URL =
  "https://sobojinski-solutions.notion.site/Home-Tee-Hero-Course-Request-14e899a015a980f3af83fabc3aff50fd";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Videos", href: "/videos" },
  { label: "What's In My Bag", href: "/whats-in-my-bag" },
  { label: "Simulator Setup", href: "/golf-simulator-setup" },
  { label: "Deals", href: "/deals" },
] as const;

export const SOCIAL_LINKS = {
  youtube: YOUTUBE_CHANNEL_URL,
  etsy: "https://www.etsy.com/shop/JustinSobojinskiGolf",
} as const;

export const AFFILIATE_CATEGORIES = [
  "Golf Clubs",
  "Golf Balls",
  "Golf Apparel",
  "Simulator Equipment",
  "Training Aids",
  "Accessories",
  "Technology",
  "Other",
] as const;
