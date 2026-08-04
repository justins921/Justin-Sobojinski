"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Youtube,
  FileText,
  Tag,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Videos", href: "/admin/videos", icon: Youtube },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Deals", href: "/admin/deals", icon: Tag },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f5f5f7" }}>
      {/* Sidebar – surface-black */}
      <aside
        className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col"
        style={{ backgroundColor: "#000000" }}
      >
        <div
          className="flex items-center gap-2 px-4"
          style={{
            height: "44px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.12px",
              color: "#ffffff",
            }}
          >
            JS Admin
          </span>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 py-3">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2"
                style={{
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  backgroundColor: active
                    ? "rgba(41, 151, 255, 0.15)"
                    : "transparent",
                  color: active ? "#2997ff" : "rgba(255, 255, 255, 0.7)",
                  transition: "background-color 0.15s ease",
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          className="px-2 py-3 space-y-0.5"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2"
            style={{
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.7)",
              transition: "background-color 0.15s ease",
            }}
          >
            <ChevronLeft size={16} /> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2"
            style={{
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#ff453a",
              transition: "background-color 0.15s ease",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-56 flex-1">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
