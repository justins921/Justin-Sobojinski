import { notFound } from "next/navigation";
import ContentRenderer from "@/components/content/ContentRenderer";
import { getContentPage } from "@/lib/data";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/whats-in-my-bag", {
  title: "What's In My Bag",
  description:
    "The clubs, ball, and gear Justin Sobojinski currently carries.",
});

export default async function WhatsInMyBagPage() {
  const page = await getContentPage("whats-in-my-bag");
  if (!page) notFound();

  return (
    <div className="container-page" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <header className="mb-10">
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
            {page.title}
          </h1>
          {page.description && (
            <p
              className="mt-3"
              style={{
                fontSize: "17px",
                fontWeight: 400,
                lineHeight: 1.47,
                letterSpacing: "-0.374px",
                color: "#7a7a7a",
              }}
            >
              {page.description}
            </p>
          )}
        </header>
        <ContentRenderer blocks={page.content} />
      </div>
    </div>
  );
}
