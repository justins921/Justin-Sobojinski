import Image from "next/image";
import { Info, Lightbulb, AlertTriangle, Check, X } from "lucide-react";
import type { ContentBlock } from "@/types/database";

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      const Tag = `h${block.level}` as "h1" | "h2" | "h3";
      return <Tag key={index}>{block.text}</Tag>;

    case "paragraph":
      return (
        <p
          key={index}
          dangerouslySetInnerHTML={{ __html: block.text }}
        />
      );

    case "image":
      return (
        <figure key={index} className="my-6">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={block.url}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "table":
      return (
        <div key={index} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-semibold text-gray-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-100 even:bg-gray-50/50"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 text-gray-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout": {
      const variants = {
        info: {
          bg: "bg-blue-50 border-blue-200",
          icon: <Info size={18} className="text-blue-600" />,
        },
        tip: {
          bg: "bg-green-50 border-green-200",
          icon: <Lightbulb size={18} className="text-green-600" />,
        },
        warning: {
          bg: "bg-amber-50 border-amber-200",
          icon: <AlertTriangle size={18} className="text-amber-600" />,
        },
      };
      const v = variants[block.variant ?? "info"];
      return (
        <div
          key={index}
          className={`my-6 rounded-lg border p-4 ${v.bg}`}
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0">{block.emoji || v.icon}</span>
            <div>
              <p className="font-semibold text-gray-900">{block.title}</p>
              <p className="mt-1 text-sm text-gray-600">{block.text}</p>
            </div>
          </div>
        </div>
      );
    }

    case "pros_cons":
      return (
        <div key={index} className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-green-800">
              <Check size={16} /> Pros
            </h4>
            <ul className="space-y-1.5">
              {block.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                  <Check size={14} className="mt-0.5 shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-red-800">
              <X size={16} /> Cons
            </h4>
            <ul className="space-y-1.5">
              {block.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <X size={14} className="mt-0.5 shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    case "product_card":
      return (
        <a
          key={index}
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-6 flex gap-4 rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
        >
          {block.image_url && (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={block.image_url}
                alt={block.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{block.title}</h4>
            <p className="mt-1 text-sm text-gray-500">{block.description}</p>
            {block.price && (
              <p className="mt-2 font-bold text-brand-700">{block.price}</p>
            )}
          </div>
        </a>
      );

    case "divider":
      return <hr key={index} className="my-8 border-gray-200" />;

    default:
      return null;
  }
}

export default function ContentRenderer({
  blocks,
}: {
  blocks: ContentBlock[];
}) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
        <p className="text-sm text-gray-500">
          This page doesn&apos;t have any content yet. Add content via the admin
          dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="prose-content">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
