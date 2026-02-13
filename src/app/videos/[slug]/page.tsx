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
    <div className="container-page py-12 sm:py-16">
      <Link
        href="/videos"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={14} /> Back to Videos
      </Link>

      <div className="mx-auto max-w-4xl">
        {/* Video Embed */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {video.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} />
              {new Date(video.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {video.view_count !== null && (
              <span className="inline-flex items-center gap-1">
                <Eye size={14} />
                {video.view_count.toLocaleString()} views
              </span>
            )}
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800"
            >
              Watch on YouTube <ExternalLink size={14} />
            </a>
          </div>

          {video.description && (
            <div className="mt-6 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
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
