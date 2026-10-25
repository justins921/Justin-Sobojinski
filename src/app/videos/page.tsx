import VideoLibrary from "@/components/videos/VideoLibrary";
import { getVideos } from "@/lib/data";
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
  const videos = await getVideos();

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

      <VideoLibrary videos={videos} initialQuery={search} />
    </div>
  );
}
