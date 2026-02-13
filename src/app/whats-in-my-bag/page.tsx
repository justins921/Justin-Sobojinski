import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentRenderer from "@/components/content/ContentRenderer";
import { getContentPage } from "@/lib/data";

export const metadata: Metadata = {
  title: "What's In My Bag",
  description:
    "A complete breakdown of the golf equipment Justin Sobojinski carries on the course — clubs, balls, accessories, and more.",
};

export default async function WhatsInMyBagPage() {
  const page = await getContentPage("whats-in-my-bag");
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
