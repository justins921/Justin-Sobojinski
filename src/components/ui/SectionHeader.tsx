import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "View All",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 sm:inline-flex"
        >
          {linkText} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
