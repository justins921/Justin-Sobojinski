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
          <div
            className="relative aspect-video overflow-hidden"
            style={{ borderRadius: "11px" }}
          >
            <Image
              src={block.url}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {block.caption && (
            <figcaption
              className="mt-2 text-center"
              style={{
                fontSize: "14px",
                lineHeight: 1.43,
                letterSpacing: "-0.224px",
                color: "#7a7a7a",
              }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "table":
      return (
        <div key={index} className="my-6 overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{ fontSize: "14px" }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #e0e0e0",
                  backgroundColor: "#f5f5f7",
                }}
              >
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    className="text-left"
                    style={{
                      padding: "12px 17px",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1d1d1f",
                    }}
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
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        padding: "12px 17px",
                        fontSize: "14px",
                        lineHeight: 1.43,
                        color: "#333333",
                      }}
                    >
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
          bg: "#f5f5f7",
          border: "#e0e0e0",
          icon: <Info size={18} style={{ color: "#0066cc" }} />,
        },
        tip: {
          bg: "#f0f5ff",
          border: "#cce0ff",
          icon: <Lightbulb size={18} style={{ color: "#0066cc" }} />,
        },
        warning: {
          bg: "#fef9f0",
          border: "#f0e0c8",
          icon: <AlertTriangle size={18} style={{ color: "#b25000" }} />,
        },
      };
      const v = variants[block.variant ?? "info"];
      return (
        <div
          key={index}
          className="my-6 flex items-start gap-3"
          style={{
            borderRadius: "11px",
            border: `1px solid ${v.border}`,
            backgroundColor: v.bg,
            padding: "17px",
          }}
        >
          <span className="mt-0.5 shrink-0">{block.emoji || v.icon}</span>
          <div>
            <p
              style={{
                fontWeight: 600,
                fontSize: "17px",
                color: "#1d1d1f",
              }}
            >
              {block.title}
            </p>
            <p
              className="mt-1"
              style={{
                fontSize: "14px",
                lineHeight: 1.43,
                color: "#333333",
              }}
            >
              {block.text}
            </p>
          </div>
        </div>
      );
    }

    case "pros_cons":
      return (
        <div key={index} className="my-6 grid gap-4 sm:grid-cols-2">
          <div
            style={{
              borderRadius: "11px",
              border: "1px solid #c8e6c9",
              backgroundColor: "#f1f8f1",
              padding: "17px",
            }}
          >
            <h4
              className="mb-3 flex items-center gap-2"
              style={{
                fontWeight: 600,
                fontSize: "17px",
                color: "#2e7d32",
              }}
            >
              <Check size={16} /> Pros
            </h4>
            <ul className="space-y-1.5">
              {block.pros.map((pro, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2"
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.43,
                    color: "#388e3c",
                  }}
                >
                  <Check size={14} className="mt-0.5 shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              borderRadius: "11px",
              border: "1px solid #ffcdd2",
              backgroundColor: "#fef5f5",
              padding: "17px",
            }}
          >
            <h4
              className="mb-3 flex items-center gap-2"
              style={{
                fontWeight: 600,
                fontSize: "17px",
                color: "#c62828",
              }}
            >
              <X size={16} /> Cons
            </h4>
            <ul className="space-y-1.5">
              {block.cons.map((con, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2"
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.43,
                    color: "#d32f2f",
                  }}
                >
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
          className="my-6 flex gap-4 transition-transform active:scale-95"
          style={{
            borderRadius: "18px",
            border: "1px solid #e0e0e0",
            padding: "17px",
          }}
        >
          {block.image_url && (
            <div
              className="relative shrink-0 overflow-hidden"
              style={{
                height: "96px",
                width: "96px",
                borderRadius: "11px",
              }}
            >
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
            <h4
              style={{
                fontWeight: 600,
                fontSize: "17px",
                color: "#1d1d1f",
              }}
            >
              {block.title}
            </h4>
            <p
              className="mt-1"
              style={{
                fontSize: "14px",
                lineHeight: 1.43,
                color: "#7a7a7a",
              }}
            >
              {block.description}
            </p>
            {block.price && (
              <p
                className="mt-2"
                style={{
                  fontWeight: 600,
                  fontSize: "17px",
                  color: "#0066cc",
                }}
              >
                {block.price}
              </p>
            )}
          </div>
        </a>
      );

    case "divider":
      return (
        <hr
          key={index}
          className="my-8"
          style={{ border: "none", borderTop: "1px solid #f0f0f0" }}
        />
      );

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
      <div
        className="p-12 text-center"
        style={{
          borderRadius: "18px",
          border: "2px dashed #e0e0e0",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#7a7a7a",
          }}
        >
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
