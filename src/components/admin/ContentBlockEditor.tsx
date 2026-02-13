"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { ContentBlock } from "@/types/database";

const BLOCK_TYPES = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "image", label: "Image" },
  { type: "table", label: "Table" },
  { type: "callout", label: "Callout" },
  { type: "pros_cons", label: "Pros & Cons" },
  { type: "product_card", label: "Product Card" },
  { type: "divider", label: "Divider" },
] as const;

function newBlock(type: string): ContentBlock {
  switch (type) {
    case "heading":
      return { type: "heading", level: 2, text: "" };
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "image":
      return { type: "image", url: "", alt: "" };
    case "table":
      return { type: "table", headers: ["Column 1", "Column 2"], rows: [["", ""]] };
    case "callout":
      return { type: "callout", title: "", text: "", variant: "info" };
    case "pros_cons":
      return { type: "pros_cons", pros: [""], cons: [""] };
    case "product_card":
      return { type: "product_card", title: "", image_url: "", description: "", url: "" };
    case "divider":
      return { type: "divider" };
    default:
      return { type: "paragraph", text: "" };
  }
}

interface Props {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function ContentBlockEditor({ blocks, onChange }: Props) {
  function updateBlock(index: number, updated: ContentBlock) {
    const newBlocks = [...blocks];
    newBlocks[index] = updated;
    onChange(newBlocks);
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks);
  }

  function addBlock(type: string) {
    onChange([...blocks, newBlock(type)]);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Content Blocks ({blocks.length})
      </label>

      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                {block.type}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => moveBlock(index, -1)}
                  className="rounded p-1 hover:bg-gray-200"
                  disabled={index === 0}
                >
                  <ChevronUp size={12} />
                </button>
                <button
                  onClick={() => moveBlock(index, 1)}
                  className="rounded p-1 hover:bg-gray-200"
                  disabled={index === blocks.length - 1}
                >
                  <ChevronDown size={12} />
                </button>
                <button
                  onClick={() => removeBlock(index)}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {block.type === "heading" && (
              <div className="space-y-2">
                <select
                  value={block.level}
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      level: parseInt(e.target.value) as 1 | 2 | 3,
                    })
                  }
                  className="rounded border border-gray-300 px-2 py-1 text-xs"
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
                <input
                  type="text"
                  value={block.text}
                  onChange={(e) =>
                    updateBlock(index, { ...block, text: e.target.value })
                  }
                  placeholder="Heading text"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
            )}

            {block.type === "paragraph" && (
              <textarea
                rows={3}
                value={block.text}
                onChange={(e) =>
                  updateBlock(index, { ...block, text: e.target.value })
                }
                placeholder="Paragraph text (HTML supported)"
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            )}

            {block.type === "image" && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={block.url}
                  onChange={(e) =>
                    updateBlock(index, { ...block, url: e.target.value })
                  }
                  placeholder="Image URL"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={block.alt}
                  onChange={(e) =>
                    updateBlock(index, { ...block, alt: e.target.value })
                  }
                  placeholder="Alt text"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={block.caption || ""}
                  onChange={(e) =>
                    updateBlock(index, { ...block, caption: e.target.value })
                  }
                  placeholder="Caption (optional)"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
            )}

            {block.type === "callout" && (
              <div className="space-y-2">
                <select
                  value={block.variant || "info"}
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      variant: e.target.value as "info" | "tip" | "warning",
                    })
                  }
                  className="rounded border border-gray-300 px-2 py-1 text-xs"
                >
                  <option value="info">Info</option>
                  <option value="tip">Tip</option>
                  <option value="warning">Warning</option>
                </select>
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) =>
                    updateBlock(index, { ...block, title: e.target.value })
                  }
                  placeholder="Callout title"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <textarea
                  rows={2}
                  value={block.text}
                  onChange={(e) =>
                    updateBlock(index, { ...block, text: e.target.value })
                  }
                  placeholder="Callout text"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
            )}

            {block.type === "pros_cons" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-green-700">Pros</label>
                  {block.pros.map((pro, i) => (
                    <input
                      key={i}
                      type="text"
                      value={pro}
                      onChange={(e) => {
                        const newPros = [...block.pros];
                        newPros[i] = e.target.value;
                        updateBlock(index, { ...block, pros: newPros });
                      }}
                      className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  ))}
                  <button
                    onClick={() =>
                      updateBlock(index, {
                        ...block,
                        pros: [...block.pros, ""],
                      })
                    }
                    className="mt-1 text-xs text-brand-700"
                  >
                    + Add Pro
                  </button>
                </div>
                <div>
                  <label className="text-xs font-medium text-red-700">Cons</label>
                  {block.cons.map((con, i) => (
                    <input
                      key={i}
                      type="text"
                      value={con}
                      onChange={(e) => {
                        const newCons = [...block.cons];
                        newCons[i] = e.target.value;
                        updateBlock(index, { ...block, cons: newCons });
                      }}
                      className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  ))}
                  <button
                    onClick={() =>
                      updateBlock(index, {
                        ...block,
                        cons: [...block.cons, ""],
                      })
                    }
                    className="mt-1 text-xs text-brand-700"
                  >
                    + Add Con
                  </button>
                </div>
              </div>
            )}

            {block.type === "product_card" && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) =>
                    updateBlock(index, { ...block, title: e.target.value })
                  }
                  placeholder="Product name"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <input
                  type="url"
                  value={block.image_url}
                  onChange={(e) =>
                    updateBlock(index, { ...block, image_url: e.target.value })
                  }
                  placeholder="Image URL"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={block.description}
                  onChange={(e) =>
                    updateBlock(index, { ...block, description: e.target.value })
                  }
                  placeholder="Description"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="url"
                    value={block.url}
                    onChange={(e) =>
                      updateBlock(index, { ...block, url: e.target.value })
                    }
                    placeholder="Link URL"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                  <input
                    type="text"
                    value={block.price || ""}
                    onChange={(e) =>
                      updateBlock(index, { ...block, price: e.target.value })
                    }
                    placeholder="Price (optional)"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
              </div>
            )}

            {block.type === "table" && (
              <div className="space-y-2 text-xs">
                <p className="text-gray-500">
                  Headers: {block.headers.join(", ")} · {block.rows.length} rows
                </p>
                <p className="text-gray-400">
                  (Full table editor — edit JSON directly for now, or use Notion import)
                </p>
              </div>
            )}

            {block.type === "divider" && (
              <hr className="border-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Add block */}
      <div className="mt-3 flex flex-wrap gap-2">
        {BLOCK_TYPES.map((bt) => (
          <button
            key={bt.type}
            onClick={() => addBlock(bt.type)}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-brand-400 hover:text-brand-700"
          >
            <Plus size={12} /> {bt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
