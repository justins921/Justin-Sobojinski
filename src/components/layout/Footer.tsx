import Link from "next/link";
import { NAV_LINKS, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#f5f5f7" }}>
      <div className="container-page" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span
              className="font-semibold"
              style={{ fontSize: "14px", color: "#1d1d1f" }}
            >
              {SITE_NAME}
            </span>
            <p
              style={{
                marginTop: "12px",
                fontSize: "14px",
                lineHeight: 1.43,
                letterSpacing: "-0.224px",
                color: "#7a7a7a",
              }}
            >
              Golf gear reviews, simulator setups, and custom Etsy products.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: 1.43,
                letterSpacing: "-0.224px",
                color: "#1d1d1f",
              }}
            >
              Navigation
            </h3>
            <ul style={{ marginTop: "12px" }} className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:underline"
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: 2.41,
                      letterSpacing: "-0.12px",
                      color: "#424245",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: 1.43,
                letterSpacing: "-0.224px",
                color: "#1d1d1f",
              }}
            >
              Content
            </h3>
            <ul style={{ marginTop: "12px" }} className="space-y-2">
              <li>
                <Link
                  href="/home-tee-hero-course-request"
                  className="transition-colors hover:underline"
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: 2.41,
                    letterSpacing: "-0.12px",
                    color: "#424245",
                  }}
                >
                  HTH Course Request
                </Link>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:underline"
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: 2.41,
                    letterSpacing: "-0.12px",
                    color: "#424245",
                  }}
                >
                  YouTube Channel
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.etsy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:underline"
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: 2.41,
                    letterSpacing: "-0.12px",
                    color: "#424245",
                  }}
                >
                  Etsy Shop
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: 1.43,
                letterSpacing: "-0.224px",
                color: "#1d1d1f",
              }}
            >
              Connect
            </h3>
            <ul style={{ marginTop: "12px" }} className="space-y-2">
              <li>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:underline"
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: 2.41,
                    letterSpacing: "-0.12px",
                    color: "#424245",
                  }}
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.etsy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:underline"
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: 2.41,
                    letterSpacing: "-0.12px",
                    color: "#424245",
                  }}
                >
                  Etsy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <p
            className="text-center"
            style={{
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: "-0.12px",
              color: "#7a7a7a",
            }}
          >
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
