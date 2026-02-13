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
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <Image
          src={video.thumbnail_high_url || video.thumbnail_url}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <Play size={20} className="ml-0.5 text-brand-700" fill="currentColor" />
          </div>
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-brand-700">
          {video.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500">{formatDate(video.published_at)}</p>
        {video.view_count !== null && (
          <p className="text-xs text-gray-400">
            {video.view_count.toLocaleString()} views
          </p>
        )}
      </div>
    </Link>
  );
}
