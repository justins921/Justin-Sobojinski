import type { Metadata } from "next";
import { Youtube } from "lucide-react";
import VideoCard from "@/components/ui/VideoCard";
import VideoSearch from "@/components/videos/VideoSearch";
import { getVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Browse the full YouTube video library from Justin Sobojinski Golf — reviews, simulator content, course plays, and more.",
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function VideosPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.q || "";
  const videos = await getVideos({ search: search || undefined });

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Video Library
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Searchable archive of all YouTube uploads.
        </p>
      </div>

      <VideoSearch initialQuery={search} />

      {videos.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <Youtube className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {search ? "No videos found" : "No Videos Yet"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {search
              ? `No videos matching "${search}". Try a different search.`
              : "Videos will appear here once the YouTube sync is configured."}
          </p>
        </div>
      )}
    </div>
  );
}
