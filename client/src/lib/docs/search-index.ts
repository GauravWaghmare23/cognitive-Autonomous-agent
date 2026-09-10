import { allDocPages } from "./registry";
import { DocBlock } from "./types";
import { NAV } from "./nav";

export interface SearchIndexEntry {
  slug: string;
  title: string;
  group: string;
  groupTitle: string;
  text: string;
}

function extractBlockText(block: DocBlock): string {
  switch (block.type) {
    case "paragraph":
      return block.text;
    case "heading":
      return block.text;
    case "callout":
      return `${block.title ? block.title + " " : ""}${block.text}`;
    case "code":
      return `${block.label || ""} ${block.code}`;
    case "flow":
      return `${block.steps.join(" ")} ${block.caption || ""}`;
    case "list":
      return block.items.join(" ");
    case "table":
      return `${block.headers.join(" ")} ${block.rows.flat().join(" ")}`;
    case "keyvalue":
      return block.items.map((i) => `${i.label}: ${i.value}`).join(" ");
    case "divider":
      return "";
    default:
      return "";
  }
}

export function buildSearchIndex(): SearchIndexEntry[] {
  const groupMap = new Map<string, string>();
  for (const g of NAV) {
    groupMap.set(g.id, g.title);
  }

  return allDocPages.map((page) => {
    const combinedText = page.blocks.map(extractBlockText).join(" ");
    return {
      slug: page.slug,
      title: page.title,
      group: page.group,
      groupTitle: groupMap.get(page.group) || page.group,
      text: `${page.description} ${combinedText}`,
    };
  });
}

export const searchIndex: SearchIndexEntry[] = buildSearchIndex();
