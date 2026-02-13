"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { AffiliateLink } from "@/types/database";
import { AFFILIATE_CATEGORIES } from "@/lib/constants";

const EMPTY_LINK: Partial<AffiliateLink> = {
  title: "",
  description: "",
  url: "",
  image_url: "",
  category: "Other",
  discount_code: "",
  discount_text: "",
  is_featured: false,
  sort_order: 0,
  is_active: true,
};

export default function AdminDealsPage() {
  const supabase = createSupabaseBrowserClient();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [editing, setEditing] = useState<Partial<AffiliateLink> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchLinks = useCallback(async () => {
    const { data } = await supabase
      .from("affiliate_links")
      .select("*")
      .order("sort_order", { ascending: true });
    setLinks((data as AffiliateLink[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await supabase.from("affiliate_links").update(editing).eq("id", editing.id);
      } else {
        await supabase.from("affiliate_links").insert(editing);
      }
      setEditing(null);
      fetchLinks();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this deal?")) return;
    await supabase.from("affiliate_links").delete().eq("id", id);
    fetchLinks();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Deals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your affiliate links and recommended gear.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_LINK })}
          className="btn-primary text-sm"
        >
          <Plus size={16} className="mr-1" /> Add Deal
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-gray-900">{link.title}</p>
              <p className="text-sm text-gray-500">
                {link.category} · {link.is_active ? "Active" : "Inactive"}
                {link.discount_code && ` · Code: ${link.discount_code}`}
              </p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditing({ ...link })} className="btn-ghost">
                <Pencil size={14} />
              </button>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => handleDelete(link.id)}
                className="btn-ghost text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            No deals yet. Click &ldquo;Add Deal&rdquo; to get started.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900">
              {editing.id ? "Edit Deal" : "Add Deal"}
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={editing.url || ""}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={editing.image_url || ""}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={editing.category || "Other"}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {AFFILIATE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                  <input
                    type="number"
                    value={editing.sort_order || 0}
                    onChange={(e) =>
                      setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount Code</label>
                  <input
                    type="text"
                    value={editing.discount_code || ""}
                    onChange={(e) => setEditing({ ...editing, discount_code: e.target.value })}
                    placeholder="e.g., JUSTIN10"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount Text</label>
                  <input
                    type="text"
                    value={editing.discount_text || ""}
                    onChange={(e) => setEditing({ ...editing, discount_text: e.target.value })}
                    placeholder="e.g., 10% off with code"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.is_featured || false}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.is_active ?? true}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setEditing(null)} className="btn-secondary text-sm">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
