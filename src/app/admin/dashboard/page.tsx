import AdminShell from "@/components/admin/AdminShell";
import { ShoppingBag, Youtube, FileText, Tag } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Products",
      href: "/admin/products",
      icon: ShoppingBag,
      description: "Manage Etsy product listings",
    },
    {
      label: "Videos",
      href: "/admin/videos",
      icon: Youtube,
      description: "View synced YouTube videos",
    },
    {
      label: "Content Pages",
      href: "/admin/pages",
      icon: FileText,
      description: "Edit gear guides and evergreen pages",
    },
    {
      label: "Affiliate Deals",
      href: "/admin/deals",
      icon: Tag,
      description: "Manage affiliate links and deals",
    },
  ];

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the Justin Sobojinski Golf admin panel.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.href}
              href={stat.href}
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{stat.label}</h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  {stat.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/admin/products" className="btn-primary text-sm">
            Add Product
          </a>
          <a href="/admin/deals" className="btn-secondary text-sm">
            Add Deal
          </a>
          <a href="/admin/pages" className="btn-secondary text-sm">
            Edit Pages
          </a>
        </div>
      </div>
    </AdminShell>
  );
}
