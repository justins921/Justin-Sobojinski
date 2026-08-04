import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { Video } from "@/types/database";

function formatDuration(isoDuration: string | null): string {
  if (!isoDuration) return "";
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const hours = match[1] ? `${match[1]}:` : "";
  const minutes = match[2] ?? "0";
  const seconds = (match[3] ?? "0").padStart(2, "0");
  return `${hours}${hours ? minutes.padStart(2, "0") : minutes}:${seconds}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/videos/${video.slug}`} className="card group flex flex-col">
      <div
        className="relative aspect-video overflow-hidden"
        style={{ backgroundColor: "#f5f5f7" }}
      >
        <Image
          src={video.thumbnail_high_url || video.thumbnail_url}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <Play
              size={20}
              className="ml-0.5"
              style={{ color: "#0066cc" }}
              fill="currentColor"
            />
          </div>
        </div>
        {video.duration && (
          <span
            className="absolute bottom-2 right-2 rounded px-1.5 py-0.5"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              fontSize: "12px",
              fontWeight: 500,
              color: "#ffffff",
            }}
          >
            {formatDuration(video.duration)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="line-clamp-2"
          style={{
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: 1.47,
            letterSpacing: "-0.374px",
            color: "#1d1d1f",
          }}
        >
          {video.title}
        </h3>
        <p
          className="mt-1"
          style={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: 1.43,
            letterSpacing: "-0.224px",
            color: "#7a7a7a",
          }}
        >
          {formatDate(video.published_at)}
        </p>
        {video.view_count !== null && (
          <p
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.43,
              letterSpacing: "-0.224px",
              color: "#7a7a7a",
            }}
          >
            {video.view_count.toLocaleString()} views
          </p>
        )}
      </div>
    </Link>
  );
}
