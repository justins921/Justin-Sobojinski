import { cache } from "react";
import type { Video } from "@/types/database";
import { YOUTUBE_CHANNEL_ID } from "@/lib/constants";

/** Revalidate the public channel feed hourly. */
export const VIDEO_REVALIDATE_SECONDS = 3600;

const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

/**
 * Real uploads used only when the public RSS feed cannot be loaded.
 * No view counts — those are not hardcoded.
 */
const FALLBACK_VIDEOS: Array<{
  videoId: string;
  title: string;
  publishedAt: string;
}> = [
  {
    videoId: "igbBsDtnOn0",
    title: "Stack Wedging Tournament Prep",
    publishedAt: "2026-07-22T12:00:00.000Z",
  },
  {
    videoId: "WfuU0Ql_3KM",
    title: "GOLFTEC Tournament Prep July 10th, 2026",
    publishedAt: "2026-07-11T12:00:00.000Z",
  },
  {
    videoId: "-AJ8uTT24h8",
    title: "GOLFTEC Lesson June 29th, 2026",
    publishedAt: "2026-07-01T12:00:00.000Z",
  },
  {
    videoId: "1OxsB2dwLUo",
    title: "TheStack Practice Tracker Demo + Real Garmin R50 Practice Data",
    publishedAt: "2026-05-11T12:00:00.000Z",
  },
  {
    videoId: "6LoxySxDtIk",
    title: "HTH Tournament | Sea Pines - Harbour Town",
    publishedAt: "2026-04-19T12:00:00.000Z",
  },
];

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .trim();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function slugFor(title: string, videoId: string): string {
  const base = slugify(title) || "video";
  const suffix = videoId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 6);
  return suffix ? `${base}-${suffix}` : base;
}

function thumbnailFor(videoId: string, fromFeed?: string | null): string {
  if (fromFeed) {
    try {
      const url = new URL(fromFeed);
      if (url.hostname.endsWith("ytimg.com") || url.hostname === "img.youtube.com") {
        url.hostname = "i.ytimg.com";
        return url.toString();
      }
    } catch {
      // Fall through to the standard thumbnail URL.
    }
  }
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function toVideo(input: {
  videoId: string;
  title: string;
  publishedAt: string;
  description?: string | null;
  thumbnail?: string | null;
  viewCount?: number | null;
  url?: string | null;
}): Video {
  const thumbnail = thumbnailFor(input.videoId, input.thumbnail);
  return {
    id: input.videoId,
    video_id: input.videoId,
    title: input.title,
    description: input.description ?? null,
    published_at: input.publishedAt,
    thumbnail_url: thumbnail,
    thumbnail_high_url: thumbnail,
    duration: null,
    view_count: input.viewCount ?? null,
    url: input.url || `https://www.youtube.com/watch?v=${input.videoId}`,
    tags: [],
    slug: slugFor(input.title, input.videoId),
    is_featured: false,
    created_at: input.publishedAt,
    updated_at: input.publishedAt,
  };
}

function fallbackVideos(): Video[] {
  return FALLBACK_VIDEOS.map((video) =>
    toVideo({
      videoId: video.videoId,
      title: video.title,
      publishedAt: video.publishedAt,
    })
  );
}

function parseFeed(xml: string): Video[] {
  const entries = xml.split("<entry>").slice(1);
  const videos: Video[] = [];

  for (const rawEntry of entries) {
    const entry = rawEntry.split("</entry>")[0] ?? "";
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
    const titleRaw = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1]?.trim();
    if (!videoId || !titleRaw || !publishedAt) continue;

    const descriptionRaw = entry.match(
      /<media:description>([\s\S]*?)<\/media:description>/
    )?.[1];
    const thumbnail = entry.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1];
    const watchUrl = entry.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/)?.[1];
    const views = entry.match(/<media:statistics[^>]*views="(\d+)"/)?.[1];

    videos.push(
      toVideo({
        videoId,
        title: decodeXml(titleRaw),
        publishedAt,
        description: descriptionRaw ? decodeXml(descriptionRaw) : null,
        thumbnail,
        viewCount: views ? Number.parseInt(views, 10) : null,
        url: watchUrl ? decodeXml(watchUrl) : null,
      })
    );
  }

  return videos;
}

async function loadChannelFeed(): Promise<Video[]> {
  try {
    const response = await fetch(FEED_URL, {
      headers: {
        Accept: "application/atom+xml, application/xml, text/xml",
        "User-Agent": "justinsobojinski.com",
      },
      next: { revalidate: VIDEO_REVALIDATE_SECONDS },
    });
    if (!response.ok) return fallbackVideos();
    const xml = await response.text();
    const videos = parseFeed(xml);
    return videos.length > 0 ? videos : fallbackVideos();
  } catch (error) {
    console.error("YouTube RSS fetch failed", error);
    return fallbackVideos();
  }
}

/** Latest public uploads. RSS first, known real videos if the feed is unavailable. */
export const getChannelVideos = cache(loadChannelFeed);
