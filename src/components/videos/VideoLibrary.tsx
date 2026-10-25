"use client";

import { useEffect, useMemo, useState } from "react";
import { Youtube } from "lucide-react";
import VideoCard from "@/components/ui/VideoCard";
import VideoSearch from "@/components/videos/VideoSearch";
import { SOCIAL_LINKS } from "@/lib/constants";
import type { Video } from "@/types/database";

export default function VideoLibrary({
  videos,
  initialQuery,
}: {
  videos: Video[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trimmed = query.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const next = params.toString();
    const url = next ? `/videos?${next}` : "/videos";
    window.history.replaceState(null, "", url);
  }, [query]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return videos;
    return videos.filter((video) => video.title.toLowerCase().includes(needle));
  }, [query, videos]);

  return (
    <>
      <VideoSearch query={query} onQueryChange={setQuery} />

      {visible.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div
          className="mt-8 p-16 text-center"
          style={{
            borderRadius: "18px",
            border: "2px dashed #e0e0e0",
          }}
        >
          <Youtube className="mx-auto" size={48} style={{ color: "#d2d2d7" }} />
          <h3 className="mt-4" style={{ fontSize: "17px", fontWeight: 600, color: "#1d1d1f" }}>
            {query.trim() ? "No videos found" : "No videos to show"}
          </h3>
          <p className="mt-2" style={{ fontSize: "14px", color: "#7a7a7a" }}>
            {query.trim()
              ? `No videos matching "${query.trim()}". Try a different search.`
              : "New uploads will show up here from the channel."}
          </p>
          {!query.trim() && (
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6"
            >
              Watch on YouTube
            </a>
          )}
        </div>
      )}
    </>
  );
}
