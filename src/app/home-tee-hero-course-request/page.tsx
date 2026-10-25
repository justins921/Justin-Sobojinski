import { pageMeta } from "@/lib/metadata";
import { COURSE_REQUEST_URL } from "@/lib/constants";
import courseRequests from "@/content/course-requests.json";

export const metadata = pageMeta("/home-tee-hero-course-request", {
  title: "Home Tee Hero Course Request",
  description:
    "Courses requested for Justin to play on Home Tee Hero, and the ones already played.",
});

type CourseRequest = {
  name: string;
  requestedHoles: string | null;
  status: string;
  date: string | null;
};

const VIEWS = [
  {
    id: "requested",
    label: "Requested",
    href: "/home-tee-hero-course-request",
    match: (status: string) => status.trim().toLowerCase() === "requested",
    empty: "No courses requested yet.",
  },
  {
    id: "played",
    label: "Played",
    href: "/home-tee-hero-course-request?view=played",
    match: (status: string) => status.trim().toLowerCase() === "uploaded/published",
    empty: "No courses marked played yet.",
  },
  {
    id: "not-found",
    label: "Not Found",
    href: "/home-tee-hero-course-request?view=not-found",
    match: (status: string) => status.trim().toLowerCase() === "not found",
    empty: "No courses marked not found.",
  },
] as const;

function formatRequestDate(value: string): string {
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

interface Props {
  searchParams: Promise<{ view?: string }>;
}

export default async function HomeTeeHeroCourseRequestPage({ searchParams }: Props) {
  const params = await searchParams;
  const requests = (courseRequests as CourseRequest[]).filter(
    (request) => request.name.trim() && request.status.trim()
  );
  const views = VIEWS.filter((view) => requests.some((request) => view.match(request.status)));
  const active =
    views.find((view) => view.id === params.view) ??
    views.find((view) => view.id === "requested") ??
    views[0];
  const visible = active ? requests.filter((request) => active.match(request.status)) : [];

  return (
    <div className="container-page" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
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
            Home Tee Hero Course Request
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
            Courses to play on Home Tee Hero.
          </p>
        </div>
        <a
          href={COURSE_REQUEST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Request a course
        </a>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {views.map((view) => {
          const isActive = view.id === active?.id;
          return (
            <a
              key={view.id}
              href={view.href}
              aria-current={isActive ? "page" : undefined}
              className="inline-flex items-center font-medium"
              style={{
                fontSize: "12px",
                lineHeight: 1.0,
                letterSpacing: "-0.12px",
                padding: "5px 12px",
                borderRadius: "9999px",
                backgroundColor: isActive ? "#0066cc" : "#ffffff",
                color: isActive ? "#ffffff" : "#1d1d1f",
                border: isActive ? "1px solid #0066cc" : "1px solid #e0e0e0",
              }}
            >
              {view.label}
            </a>
          );
        })}
      </div>

      {requests.length > 0 && visible.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ fontSize: "14px" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #e0e0e0",
                  backgroundColor: "#f5f5f7",
                }}
              >
                {["Course", "Holes", "Status", "Date"].map((header) => (
                  <th
                    key={header}
                    className="text-left"
                    style={{
                      padding: "12px 17px",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1d1d1f",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((request, index) => (
                <tr
                  key={`${request.name}-${request.date ?? "none"}-${index}`}
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <td style={{ padding: "12px 17px", color: "#1d1d1f" }}>{request.name}</td>
                  <td style={{ padding: "12px 17px", color: "#333333" }}>
                    {request.requestedHoles || "—"}
                  </td>
                  <td style={{ padding: "12px 17px", color: "#333333" }}>{request.status}</td>
                  <td style={{ padding: "12px 17px", color: "#333333" }}>
                    {request.date ? formatRequestDate(request.date) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active && visible.length === 0 && (
        <p style={{ fontSize: "14px", color: "#7a7a7a" }}>{active.empty}</p>
      )}
    </div>
  );
}
