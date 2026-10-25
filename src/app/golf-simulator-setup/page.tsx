import { notFound } from "next/navigation";
import ContentRenderer from "@/components/content/ContentRenderer";
import { getContentPage } from "@/lib/data";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("/golf-simulator-setup", {
  title: "Golf Simulator Setup",
  description:
    "Justin Sobojinski's home golf simulator — Garmin R50, GSPro, Home Tee Hero, and the rest of the build.",
});

export default async function GolfSimulatorSetupPage() {
  const page = await getContentPage("golf-simulator-setup");
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
