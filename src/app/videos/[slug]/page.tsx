import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Eye } from "lucide-react";
import { getVideoBySlug } from "@/lib/data";
import { SITE_NAME } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return { title: "Video Not Found" };
  return {
    title: video.title,
    description: video.description?.slice(0, 160) ?? `Watch ${video.title} on ${SITE_NAME}`,
    openGraph: {
      title: video.title,
      description: video.description?.slice(0, 160) ?? undefined,
      images: video.thumbnail_high_url
        ? [{ url: video.thumbnail_high_url }]
        : undefined,
    },
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  return (
    <div className="container-page" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
      <Link
        href="/videos"
        className="mb-6 inline-flex items-center gap-1 transition-colors"
        style={{
          fontSize: "14px",
          fontWeight: 400,
          letterSpacing: "-0.224px",
          color: "#0066cc",
        }}
      >
        <ArrowLeft size={14} /> Back to Videos
      </Link>

      <div className="mx-auto max-w-4xl">
        {/* Video Embed – full-bleed style (0 radius) */}
        <div
          className="relative aspect-video overflow-hidden"
          style={{ backgroundColor: "#000000", borderRadius: "0" }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${video.video_id}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>

        {/* Video Info */}
        <div className="mt-6">
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
            {video.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span
              className="inline-flex items-center gap-1"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: 1.43,
                letterSpacing: "-0.224px",
                color: "#7a7a7a",
              }}
            >
              <Calendar size={14} />
              {new Date(video.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {video.view_count !== null && (
              <span
                className="inline-flex items-center gap-1"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: 1.43,
                  letterSpacing: "-0.224px",
                  color: "#7a7a7a",
                }}
              >
                <Eye size={14} />
                {video.view_count.toLocaleString()} views
              </span>
            )}
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#0066cc",
              }}
            >
              Watch on YouTube <ExternalLink size={14} />
            </a>
          </div>

          {video.description && (
            <div
              className="mt-6 whitespace-pre-wrap"
              style={{
                borderRadius: "11px",
                backgroundColor: "#f5f5f7",
                padding: "17px",
                fontSize: "14px",
                lineHeight: 1.43,
                letterSpacing: "-0.224px",
                color: "#333333",
              }}
            >
              {video.description}
            </div>
          )}

          {video.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <span key={tag} className="badge">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
