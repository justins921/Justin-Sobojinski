# Justin Sobojinski Golf

Production website for [justinsobojinski.com](https://justinsobojinski.com) — golf gear reviews, custom Etsy products, simulator setups, YouTube video library, and affiliate deals.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (Postgres + Auth + Row-Level Security)
- **Deployment:** Vercel (serverless + cron)
- **SEO:** Full metadata, OpenGraph, sitemap.xml, robots.txt

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
- `YOUTUBE_API_KEY` — YouTube Data API v3 key
- `YOUTUBE_CHANNEL_HANDLE` — Your YouTube handle (e.g., `@JustinSobojinskiGolf`)

Optional:
- `NOTION_API_KEY` — For importing content from Notion pages
- `CRON_SECRET` — Secret for authenticating Vercel cron jobs

### 3. Set up Supabase

Run the migration in `supabase/migrations/001_initial_schema.sql` against your Supabase project (via the SQL editor in the Supabase dashboard).

Create an admin user in Supabase Auth (Authentication → Users → Add user).

### 4. Run the dev server

```bash
npm run dev
```

## Site Structure

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, featured products, latest videos |
| `/shop` | Etsy product grid with category filters |
| `/videos` | Searchable YouTube video library |
| `/videos/[slug]` | Individual video detail page with embed |
| `/whats-in-my-bag` | Editable gear guide page |
| `/golf-simulator-setup` | Editable simulator setup page |
| `/home-tee-hero-course-request` | Editable course request page |
| `/deals` | Affiliate links and gear deals hub |
| `/admin/login` | Admin authentication |
| `/admin/dashboard` | Admin home with quick actions |
| `/admin/products` | CRUD for Etsy products |
| `/admin/videos` | View synced videos, trigger manual sync |
| `/admin/pages` | Edit content pages, Notion import |
| `/admin/deals` | CRUD for affiliate links |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/youtube-sync` | GET/POST | Sync YouTube videos (GET for Vercel cron, POST for manual) |
| `/api/notion-import` | POST | Import content from a Notion page |
| `/api/auth/callback` | GET | Supabase auth callback handler |

## Vercel Cron

YouTube sync runs daily at 6 AM UTC via Vercel Cron (configured in `vercel.json`).

## Content Management

All content is managed through the admin dashboard at `/admin`. Content pages use a block-based editor supporting:
- Headings (H1-H3)
- Paragraphs (with HTML)
- Images with captions
- Tables
- Callouts (info, tip, warning)
- Pros & Cons blocks
- Product cards
- Dividers
