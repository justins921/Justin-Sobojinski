export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: string;
  currency: string;
  image_url: string;
  etsy_url: string;
  category: string | null;
  tags: string[];
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  video_id: string;
  title: string;
  description: string | null;
  published_at: string;
  thumbnail_url: string;
  thumbnail_high_url: string | null;
  duration: string | null;
  view_count: number | null;
  url: string;
  tags: string[];
  slug: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  og_image: string | null;
  content: ContentBlock[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | TableBlock
  | CalloutBlock
  | ProsConsBlock
  | DividerBlock
  | ProductCardBlock;

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
}

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ImageBlock {
  type: "image";
  url: string;
  alt: string;
  caption?: string;
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

export interface CalloutBlock {
  type: "callout";
  emoji?: string;
  title: string;
  text: string;
  variant?: "info" | "tip" | "warning";
}

export interface ProsConsBlock {
  type: "pros_cons";
  title?: string;
  pros: string[];
  cons: string[];
}

export interface DividerBlock {
  type: "divider";
}

export interface ProductCardBlock {
  type: "product_card";
  title: string;
  image_url: string;
  description: string;
  url: string;
  price?: string;
}

export interface AffiliateLink {
  id: string;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  category: string;
  discount_code: string | null;
  discount_text: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}
