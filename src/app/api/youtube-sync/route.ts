import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

// Vercel Cron config
export const maxDuration = 60;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

interface YouTubeChannel {
  items?: Array<{
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
}

interface YouTubePlaylistItem {
  snippet: {
    resourceId: { videoId: string };
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

interface YouTubePlaylistResponse {
  items?: YouTubePlaylistItem[];
  nextPageToken?: string;
}

interface YouTubeVideoItem {
  id: string;
  contentDetails?: { duration?: string };
  statistics?: { viewCount?: string };
}

interface YouTubeVideoResponse {
  items?: YouTubeVideoItem[];
}

async function fetchYouTubeApi<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (res.status === 429) {
    throw new Error("YouTube API rate limit exceeded. Try again later.");
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${body}`);
  }
  return res.json();
}

async function resolveChannelId(apiKey: string, handle: string): Promise<string> {
  const cleanHandle = handle.startsWith("@") ? handle : `@${handle}`;
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(cleanHandle)}&key=${apiKey}`;
  const data = await fetchYouTubeApi<YouTubeChannel>(url);
  if (!data.items?.length) {
    throw new Error(`Channel not found for handle: ${cleanHandle}`);
  }
  return data.items[0].contentDetails?.relatedPlaylists?.uploads ?? "";
}

async function getUploadsPlaylistId(apiKey: string, channelId: string): Promise<string> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
  const data = await fetchYouTubeApi<YouTubeChannel>(url);
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? "";
}

export async function GET(request: NextRequest) {
  // Verify cron secret for scheduled calls
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return syncVideos();
}

export async function POST() {
  // Manual sync from admin (auth handled by middleware)
  return syncVideos();
}

async function syncVideos() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY not configured" },
      { status: 500 }
    );
  }

  const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE || "@JustinSobojinskiGolf";

  try {
    const supabase = await createSupabaseServiceClient();

    // Step 1: Resolve channel handle to uploads playlist
    let uploadsPlaylistId: string;
    if (channelHandle.startsWith("UC")) {
      uploadsPlaylistId = await getUploadsPlaylistId(apiKey, channelHandle);
    } else {
      uploadsPlaylistId = await resolveChannelId(apiKey, channelHandle);
    }

    if (!uploadsPlaylistId) {
      return NextResponse.json(
        { error: "Could not find uploads playlist" },
        { status: 500 }
      );
    }

    // Step 2: Fetch playlist items (paginated, up to 200 videos)
    const allItems: YouTubePlaylistItem[] = [];
    let pageToken: string | undefined;
    let pages = 0;
    const MAX_PAGES = 4;

    do {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("playlistId", uploadsPlaylistId);
      url.searchParams.set("maxResults", "50");
      url.searchParams.set("key", apiKey);
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const data = await fetchYouTubeApi<YouTubePlaylistResponse>(url.toString());
      allItems.push(...(data.items ?? []));
      pageToken = data.nextPageToken;
      pages++;
    } while (pageToken && pages < MAX_PAGES);

    // Step 3: Get video details (duration, view count) in batches of 50
    const videoIds = allItems.map((item) => item.snippet.resourceId.videoId);
    const videoDetails = new Map<string, { duration: string; viewCount: number }>();

    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50);
      const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${batch.join(",")}&key=${apiKey}`;
      const data = await fetchYouTubeApi<YouTubeVideoResponse>(url);
      for (const item of data.items ?? []) {
        videoDetails.set(item.id, {
          duration: item.contentDetails?.duration ?? "",
          viewCount: parseInt(item.statistics?.viewCount ?? "0", 10),
        });
      }
    }

    // Step 4: Upsert into Supabase
    const records = allItems.map((item) => {
      const videoId = item.snippet.resourceId.videoId;
      const details = videoDetails.get(videoId);
      const baseSlug = slugify(item.snippet.title);
      return {
        video_id: videoId,
        title: item.snippet.title,
        description: item.snippet.description || null,
        published_at: item.snippet.publishedAt,
        thumbnail_url: item.snippet.thumbnails.medium?.url ?? "",
        thumbnail_high_url: item.snippet.thumbnails.high?.url ?? null,
        duration: details?.duration ?? null,
        view_count: details?.viewCount ?? null,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        slug: `${baseSlug}-${videoId.slice(0, 6)}`,
        updated_at: new Date().toISOString(),
      };
    });

    // Upsert in batches
    let upsertCount = 0;
    for (let i = 0; i < records.length; i += 50) {
      const batch = records.slice(i, i + 50);
      const { error } = await supabase
        .from("videos")
        .upsert(batch, { onConflict: "video_id" });
      if (error) {
        console.error("Upsert error:", error);
      } else {
        upsertCount += batch.length;
      }
    }

    return NextResponse.json({
      success: true,
      count: upsertCount,
      total: allItems.length,
    });
  } catch (error) {
    console.error("YouTube sync error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}
