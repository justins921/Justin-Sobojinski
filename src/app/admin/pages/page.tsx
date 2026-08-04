"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { FileText, Pencil, Eye, Download } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { ContentPage, ContentBlock } from "@/types/database";
import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

export default function AdminPagesPage() {
  const supabase = createSupabaseBrowserClient();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [editing, setEditing] = useState<ContentPage | null>(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importSlug, setImportSlug] = useState("");
  const [notionPageId, setNotionPageId] = useState("");

  const fetchPages = useCallback(async () => {
    const { data } = await supabase
      .from("content_pages")
      .select("*")
      .order("title");
    setPages((data as ContentPage[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      await supabase
        .from("content_pages")
        .update({
          title: editing.title,
          description: editing.description,
          content: editing.content,
          is_published: editing.is_published,
        })
        .eq("id", editing.id);
      setEditing(null);
      fetchPages();
    } finally {
      setSaving(false);
    }
  }

  async function handleNotionImport() {
    if (!notionPageId || !importSlug) return;
    setImporting(true);
    try {
      const res = await fetch("/api/notion-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: notionPageId, slug: importSlug }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Imported ${data.blockCount ?? 0} blocks.`);
        fetchPages();
      } else {
        alert(data.error || "Import failed.");
      }
    } finally {
      setImporting(false);
      setNotionPageId("");
    }
  }

  function updateBlocks(blocks: ContentBlock[]) {
    if (!editing) return;
    setEditing({ ...editing, content: blocks });
  }

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Pages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Edit your evergreen content pages (What&apos;s In My Bag, Simulator Setup, etc.)
        </p>
      </div>

      {/* Notion Import */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Download size={16} /> Import from Notion
        </h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <select
            value={importSlug}
            onChange={(e) => setImportSlug(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select page...</option>
            {pages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={notionPageId}
            onChange={(e) => setNotionPageId(e.target.value)}
            placeholder="Notion Page ID"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            onClick={handleNotionImport}
            disabled={importing || !importSlug || !notionPageId}
            className="btn-secondary text-sm disabled:opacity-50"
          >
            {importing ? "Importing..." : "Import"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Requires NOTION_API_KEY env var. Share the Notion page with your
          integration first.
        </p>
      </div>

      {/* Page List */}
      <div className="mt-6 space-y-3">
        {pages.map((page) => (
          <div
            key={page.id}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <FileText size={18} className="text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{page.title}</p>
              <p className="text-sm text-gray-500">
                /{page.slug} · {page.is_published ? "Published" : "Draft"} ·{" "}
                {(page.content as ContentBlock[]).length} blocks
              </p>
            </div>
            <div className="flex gap-1">
              <a href={`/${page.slug}`} className="btn-ghost">
                <Eye size={14} />
              </a>
              <button
                onClick={() => setEditing({ ...page })}
                className="btn-ghost"
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900">
              Edit: {editing.title}
            </h2>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editing.title}
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
                  <input
                    type="text"
                    value={editing.description || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_published}
                  onChange={(e) =>
                    setEditing({ ...editing, is_published: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                Published
              </label>

              <ContentBlockEditor
                blocks={editing.content as ContentBlock[]}
                onChange={updateBlocks}
              />
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
