-- Products table (Etsy products to feature on the site)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL DEFAULT '0.00',
  currency TEXT NOT NULL DEFAULT 'USD',
  image_url TEXT NOT NULL,
  etsy_url TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Videos table (YouTube video index)
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  thumbnail_url TEXT NOT NULL,
  thumbnail_high_url TEXT,
  duration TEXT,
  view_count INTEGER,
  url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  slug TEXT UNIQUE NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Content pages (Notion-like editable pages)
CREATE TABLE IF NOT EXISTS content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  og_image TEXT,
  content JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Affiliate links / deals
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Other',
  discount_code TEXT,
  discount_text TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site settings (key-value store for misc config)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_products_active ON products (is_active, sort_order);
CREATE INDEX idx_products_featured ON products (is_featured) WHERE is_featured = true;
CREATE INDEX idx_videos_published ON videos (published_at DESC);
CREATE INDEX idx_videos_slug ON videos (slug);
CREATE INDEX idx_videos_search ON videos USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_content_pages_slug ON content_pages (slug);
CREATE INDEX idx_affiliate_links_active ON affiliate_links (is_active, sort_order);
CREATE INDEX idx_affiliate_links_category ON affiliate_links (category);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_pages_updated_at BEFORE UPDATE ON content_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliate_links_updated_at BEFORE UPDATE ON affiliate_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Public can read published pages" ON content_pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active affiliate links" ON affiliate_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

-- Admin write policies (authenticated users only)
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage videos" ON videos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage content pages" ON content_pages FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage affiliate links" ON affiliate_links FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Seed default content pages
INSERT INTO content_pages (slug, title, description, content, is_published) VALUES
  ('whats-in-my-bag', 'What''s In My Bag', 'A complete breakdown of the golf equipment Justin carries on the course.', '[]', true),
  ('golf-simulator-setup', 'Golf Simulator Setup', 'Everything about my home golf simulator setup, gear, and recommendations.', '[]', true),
  ('home-tee-hero-course-request', 'Home Tee Hero Course Request', 'Request a course for Home Tee Hero! Submit your favorite courses for me to play.', '[]', true)
ON CONFLICT (slug) DO NOTHING;
