import Link from "next/link";
import { NAV_LINKS, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-xs font-bold text-white">
                JS
              </div>
              <span className="font-bold text-gray-900">{SITE_NAME}</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Golf gear reviews, simulator setups, and custom Etsy products.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Navigation</h3>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Content</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/home-tee-hero-course-request"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  HTH Course Request
                </Link>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  YouTube Channel
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.etsy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Etsy Shop
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Connect</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.etsy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Etsy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
