import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentRenderer from "@/components/content/ContentRenderer";
import { getContentPage } from "@/lib/data";

export const metadata: Metadata = {
  title: "Home Tee Hero Course Request",
  description:
    "Request a course for Justin to play on Home Tee Hero! Submit your favorite courses.",
};

export default async function HomeTeeHeroCourseRequestPage() {
  const page = await getContentPage("home-tee-hero-course-request");
  if (!page) notFound();

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {page.title}
          </h1>
          {page.description && (
            <p className="mt-3 text-lg text-gray-500">{page.description}</p>
          )}
        </header>
        <ContentRenderer blocks={page.content} />
      </div>
    </div>
  );
}
