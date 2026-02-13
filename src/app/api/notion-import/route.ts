import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import type { ContentBlock } from "@/types/database";

interface NotionRichText {
  plain_text: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
  };
}

interface NotionBlock {
  type: string;
  heading_1?: { rich_text: NotionRichText[] };
  heading_2?: { rich_text: NotionRichText[] };
  heading_3?: { rich_text: NotionRichText[] };
  paragraph?: { rich_text: NotionRichText[] };
  bulleted_list_item?: { rich_text: NotionRichText[] };
  numbered_list_item?: { rich_text: NotionRichText[] };
  image?: {
    type: string;
    external?: { url: string };
    file?: { url: string };
    caption?: NotionRichText[];
  };
  callout?: {
    icon?: { emoji?: string };
    rich_text: NotionRichText[];
  };
  divider?: object;
  table?: { has_column_header: boolean; table_width: number };
  table_row?: { cells: NotionRichText[][] };
  has_children?: boolean;
  id: string;
}

interface NotionBlocksResponse {
  results: NotionBlock[];
  has_more: boolean;
  next_cursor: string | null;
}

function richTextToHtml(texts: NotionRichText[]): string {
  return texts
    .map((t) => {
      let html = t.plain_text;
      if (t.annotations?.bold) html = `<strong>${html}</strong>`;
      if (t.annotations?.italic) html = `<em>${html}</em>`;
      if (t.annotations?.code) html = `<code>${html}</code>`;
      if (t.href) html = `<a href="${t.href}" target="_blank" rel="noopener">${html}</a>`;
      return html;
    })
    .join("");
}

function richTextToPlain(texts: NotionRichText[]): string {
  return texts.map((t) => t.plain_text).join("");
}

async function fetchNotionBlocks(
  pageId: string,
  apiKey: string,
  cursor?: string
): Promise<NotionBlocksResponse> {
  const url = new URL(
    `https://api.notion.com/v1/blocks/${pageId}/children`
  );
  url.searchParams.set("page_size", "100");
  if (cursor) url.searchParams.set("start_cursor", cursor);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
    },
  });

  if (res.status === 429) {
    // Rate limited - wait and retry once
    const retryAfter = parseInt(res.headers.get("retry-after") || "2", 10);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    const retryRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
      },
    });
    if (!retryRes.ok) {
      throw new Error(`Notion API error ${retryRes.status} after retry`);
    }
    return retryRes.json();
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API error ${res.status}: ${body}`);
  }

  return res.json();
}

async function fetchTableRows(
  blockId: string,
  apiKey: string
): Promise<NotionBlock[]> {
  const data = await fetchNotionBlocks(blockId, apiKey);
  return data.results;
}

function convertNotionBlocks(blocks: NotionBlock[], tableRows: Map<string, NotionBlock[]>): ContentBlock[] {
  const contentBlocks: ContentBlock[] = [];
  let listBuffer: string[] = [];
  let lastListType = "";

  function flushList() {
    if (listBuffer.length > 0) {
      const tag = lastListType === "numbered_list_item" ? "ol" : "ul";
      const items = listBuffer.map((item) => `<li>${item}</li>`).join("");
      contentBlocks.push({
        type: "paragraph",
        text: `<${tag}>${items}</${tag}>`,
      });
      listBuffer = [];
    }
  }

  for (const block of blocks) {
    const isList =
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item";

    if (!isList) flushList();

    switch (block.type) {
      case "heading_1":
        contentBlocks.push({
          type: "heading",
          level: 1,
          text: richTextToPlain(block.heading_1?.rich_text ?? []),
        });
        break;

      case "heading_2":
        contentBlocks.push({
          type: "heading",
          level: 2,
          text: richTextToPlain(block.heading_2?.rich_text ?? []),
        });
        break;

      case "heading_3":
        contentBlocks.push({
          type: "heading",
          level: 3,
          text: richTextToPlain(block.heading_3?.rich_text ?? []),
        });
        break;

      case "paragraph":
        if (block.paragraph?.rich_text?.length) {
          contentBlocks.push({
            type: "paragraph",
            text: richTextToHtml(block.paragraph.rich_text),
          });
        }
        break;

      case "bulleted_list_item":
      case "numbered_list_item": {
        lastListType = block.type;
        const richText =
          block.type === "bulleted_list_item"
            ? block.bulleted_list_item?.rich_text
            : block.numbered_list_item?.rich_text;
        listBuffer.push(richTextToHtml(richText ?? []));
        break;
      }

      case "image": {
        const imgUrl =
          block.image?.type === "external"
            ? block.image.external?.url
            : block.image?.file?.url;
        if (imgUrl) {
          contentBlocks.push({
            type: "image",
            url: imgUrl,
            alt: richTextToPlain(block.image?.caption ?? []) || "Image",
            caption: richTextToPlain(block.image?.caption ?? []) || undefined,
          });
        }
        break;
      }

      case "callout":
        contentBlocks.push({
          type: "callout",
          emoji: block.callout?.icon?.emoji,
          title: "",
          text: richTextToHtml(block.callout?.rich_text ?? []),
          variant: "info",
        });
        break;

      case "divider":
        contentBlocks.push({ type: "divider" });
        break;

      case "table": {
        const rows = tableRows.get(block.id) ?? [];
        if (rows.length > 0) {
          const hasHeader = block.table?.has_column_header ?? false;
          const allCells = rows.map((r) =>
            (r.table_row?.cells ?? []).map((cell) => richTextToPlain(cell))
          );
          const headers = hasHeader
            ? allCells[0]
            : allCells[0]?.map((_, i) => `Column ${i + 1}`) ?? [];
          const dataRows = hasHeader ? allCells.slice(1) : allCells;
          contentBlocks.push({
            type: "table",
            headers,
            rows: dataRows,
          });
        }
        break;
      }

      default:
        // Unsupported block type, skip
        break;
    }
  }

  flushList();
  return contentBlocks;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "NOTION_API_KEY not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { pageId, slug } = body;

  if (!pageId || !slug) {
    return NextResponse.json(
      { error: "pageId and slug are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch all blocks with pagination
    const allBlocks: NotionBlock[] = [];
    let cursor: string | undefined;

    do {
      const data = await fetchNotionBlocks(pageId, apiKey, cursor);
      allBlocks.push(...data.results);
      cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined;
    } while (cursor);

    // Fetch table children
    const tableRows = new Map<string, NotionBlock[]>();
    const tableBlocks = allBlocks.filter(
      (b) => b.type === "table" && b.has_children
    );
    for (const table of tableBlocks) {
      const rows = await fetchTableRows(table.id, apiKey);
      tableRows.set(table.id, rows);
    }

    // Convert to our content blocks
    const contentBlocks = convertNotionBlocks(allBlocks, tableRows);

    // Update the content page in Supabase
    const supabase = await createSupabaseServiceClient();
    const { error } = await supabase
      .from("content_pages")
      .update({ content: contentBlocks })
      .eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      blockCount: contentBlocks.length,
    });
  } catch (error) {
    console.error("Notion import error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Import failed",
      },
      { status: 500 }
    );
  }
}
