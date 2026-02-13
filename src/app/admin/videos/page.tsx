/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { RefreshCw, Star, ExternalLink } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Video } from "@/types/database";

export default function AdminVideosPage() {
  const supabase = createSupabaseBrowserClient();
  const [videos, setVideos] = useState<Video[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const fetchVideos = useCallback(async () => {
    const { data } = await supabase
      .from("videos")
      .select("*")
      .order("published_at", { ascending: false });
    setVideos((data as Video[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  async function handleSync() {
    setSyncing(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/youtube-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setSyncMessage(`Synced ${data.count ?? 0} videos.`);
        fetchVideos();
      } else {
        setSyncMessage(data.error || "Sync failed.");
      }
    } catch {
      setSyncMessage("Network error during sync.");
    } finally {
      setSyncing(false);
    }
  }

  async function toggleFeatured(id: string, current: boolean) {
    await supabase
      .from("videos")
      .update({ is_featured: !current })
      .eq("id", id);
    fetchVideos();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="mt-1 text-sm text-gray-500">
            YouTube videos synced from your channel. {videos.length} total.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn-primary text-sm disabled:opacity-50"
        >
          <RefreshCw size={14} className={`mr-1 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      {syncMessage && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          {syncMessage}
        </div>
      )}

      <div className="mt-6 space-y-2">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className="h-16 w-28 shrink-0 overflow-hidden rounded bg-gray-100">
              <img
                src={video.thumbnail_url}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {video.title}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(video.published_at).toLocaleDateString()}
                {video.view_count !== null &&
                  ` · ${video.view_count.toLocaleString()} views`}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => toggleFeatured(video.id, video.is_featured)}
                className={`btn-ghost ${
                  video.is_featured ? "text-amber-500" : "text-gray-400"
                }`}
                title={video.is_featured ? "Remove featured" : "Mark featured"}
              >
                <Star size={14} fill={video.is_featured ? "currentColor" : "none"} />
              </button>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            No videos synced yet. Click &ldquo;Sync Now&rdquo; to pull from YouTube.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
