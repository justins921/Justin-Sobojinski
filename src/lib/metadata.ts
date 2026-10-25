import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

/** Canonical and Open Graph URLs always use the public production origin. */
export function pageMeta(
  path: string,
  opts: { title?: string; description: string }
): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    ...(opts.title ? { title: opts.title } : {}),
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      url,
      description: opts.description,
      ...(opts.title ? { title: opts.title } : {}),
    },
  };
}
