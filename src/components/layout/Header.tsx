"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.92)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      <div className="container-page">
        <div className="flex items-center justify-between" style={{ height: "44px" }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="font-semibold text-white"
              style={{ fontSize: "14px", letterSpacing: "-0.12px" }}
            >
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors"
                style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: 1.0,
                  letterSpacing: "-0.12px",
                  color:
                    pathname === link.href
                      ? "#2997ff"
                      : "rgba(255, 255, 255, 0.8)",
                }}
                onMouseEnter={(e) => {
                  if (pathname !== link.href) {
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== link.href) {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center p-1 md:hidden"
            style={{ color: "rgba(255, 255, 255, 0.8)" }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav
            className="pb-4 pt-2 md:hidden"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  letterSpacing: "-0.12px",
                  color:
                    pathname === link.href
                      ? "#2997ff"
                      : "rgba(255, 255, 255, 0.8)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
