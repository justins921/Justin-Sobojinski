import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
  dark?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "View All",
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2
          style={{
            fontFamily:
              '"SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: "40px",
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "0",
            color: dark ? "#ffffff" : "#1d1d1f",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mt-1"
            style={{
              fontSize: "17px",
              fontWeight: 400,
              lineHeight: 1.47,
              letterSpacing: "-0.374px",
              color: dark ? "rgba(255, 255, 255, 0.5)" : "#7a7a7a",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden items-center gap-1 sm:inline-flex"
          style={{
            fontSize: "17px",
            fontWeight: 500,
            color: dark ? "#2997ff" : "#0066cc",
          }}
        >
          {linkText} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
