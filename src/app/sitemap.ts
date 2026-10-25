import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getVideos } from "@/lib/data";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/shop",
    "/videos",
    "/deals",
    "/whats-in-my-bag",
    "/golf-simulator-setup",
    "/home-tee-hero-course-request",
  ];

  const pages: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/videos" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const videos = await getVideos();
  for (const video of videos) {
    pages.push({
      url: `${SITE_URL}/videos/${video.slug}`,
      lastModified: new Date(video.published_at),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return pages;
}
