export const SITE_NAME = "Justin Sobojinski Golf";
export const SITE_DESCRIPTION =
  "Golf gear reviews, simulator setups, Etsy products, and more from Justin Sobojinski.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://justinsobojinski.com";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Videos", href: "/videos" },
  { label: "What's In My Bag", href: "/whats-in-my-bag" },
  { label: "Simulator Setup", href: "/golf-simulator-setup" },
  { label: "Deals", href: "/deals" },
] as const;

export const SOCIAL_LINKS = {
  youtube: "https://youtube.com/@JustinSobojinskiGolf",
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
