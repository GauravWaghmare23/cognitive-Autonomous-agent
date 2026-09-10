export type DocBlock =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "callout"; tone: "info" | "warning" | "success" | "danger"; title?: string; text: string }
  | { type: "code"; lang: string; label?: string; code: string }
  | { type: "flow"; steps: string[]; caption?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "keyvalue"; items: { label: string; value: string }[] }
  | { type: "divider" };

export interface DocPage {
  slug: string;       // relative to /docs, e.g. "agents/explorer"
  group: string;      // must match a NavGroup id in nav.ts
  title: string;
  description: string;
  status?: "stable" | "coming-soon";
  blocks: DocBlock[];
}

export interface NavItem {
  title: string;
  slug: string;
  status?: "stable" | "coming-soon";
  badge?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}
