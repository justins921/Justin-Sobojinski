import { Youtube } from "lucide-react";
import VideoCard from "@/components/ui/VideoCard";
import VideoSearch from "@/components/videos/VideoSearch";
import { getVideos } from "@/lib/data";
import { SOCIAL_LINKS } from "@/lib/constants";
import { pageMeta } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = pageMeta("/videos", {
  title: "Videos",
  description:
    "Latest uploads from Justin Sobojinski's YouTube channel.",
});

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function VideosPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.q || "";
  const videos = await getVideos({ search: search || undefined });

  return (
    <div className="container-page" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
      <div className="mb-10">
        <h1
          style={{
            fontFamily:
              '"SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "40px",
            fontWeight: 600,
            lineHeight: 1.1,
            color: "#1d1d1f",
          }}
        >
          Video Library
        </h1>
        <p
          className="mt-2"
          style={{
            fontSize: "17px",
            fontWeight: 400,
            lineHeight: 1.47,
            letterSpacing: "-0.374px",
            color: "#7a7a7a",
          }}
        >
          Latest uploads from the channel.
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
        <div
          className="mt-8 p-16 text-center"
          style={{
            borderRadius: "18px",
            border: "2px dashed #e0e0e0",
          }}
        >
          <Youtube
            className="mx-auto"
            size={48}
            style={{ color: "#d2d2d7" }}
          />
          <h3
            className="mt-4"
            style={{ fontSize: "17px", fontWeight: 600, color: "#1d1d1f" }}
          >
            {search ? "No videos found" : "No videos to show"}
          </h3>
          <p
            className="mt-2"
            style={{ fontSize: "14px", color: "#7a7a7a" }}
          >
            {search
              ? `No videos matching "${search}". Try a different search.`
              : "New uploads will show up here from the channel."}
          </p>
          {!search && (
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
    </div>
  );
}
