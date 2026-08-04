/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Product } from "@/types/database";

const EMPTY_PRODUCT: Partial<Product> = {
  title: "",
  description: "",
  price: "0.00",
  currency: "USD",
  image_url: "",
  etsy_url: "",
  category: "",
  tags: [],
  is_featured: false,
  sort_order: 0,
  is_active: true,
};

export default function AdminProductsPage() {
  const supabase = createSupabaseBrowserClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    setProducts((data as Product[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await supabase
          .from("products")
          .update(editing)
          .eq("id", editing.id);
      } else {
        await supabase.from("products").insert(editing);
      }
      setEditing(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your Etsy product listings displayed on the site.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_PRODUCT })}
          className="btn-primary text-sm"
        >
          <Plus size={16} className="mr-1" /> Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="mt-6 space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-gray-900">
                {product.title}
              </p>
              <p className="text-sm text-gray-500">
                ${product.price} · {product.is_active ? "Active" : "Inactive"}
                {product.is_featured && " · Featured"}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setEditing({ ...product })}
                className="btn-ghost"
              >
                <Pencil size={14} />
              </button>
              <a
                href={product.etsy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => handleDelete(product.id)}
                className="btn-ghost text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            No products yet. Click &ldquo;Add Product&rdquo; to get started.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900">
              {editing.id ? "Edit Product" : "Add Product"}
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editing.title || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editing.description || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="text"
                    value={editing.price || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, price: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={editing.category || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editing.image_url || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, image_url: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Etsy URL
                </label>
                <input
                  type="url"
                  value={editing.etsy_url || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, etsy_url: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                  <input
                    type="number"
                    value={editing.sort_order || 0}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        sort_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editing.is_featured || false}
                      onChange={(e) =>
                        setEditing({ ...editing, is_featured: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editing.is_active ?? true}
                      onChange={(e) =>
                        setEditing({ ...editing, is_active: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setEditing(null)}
                className="btn-secondary text-sm"
              >
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
