import { NavGroup, NavItem } from "./types";

export const NAV: NavGroup[] = [
  {
    id: "introduction",
    title: "Introduction",
    items: [
      { title: "Overview", slug: "introduction/overview" },
      { title: "Core Concepts", slug: "introduction/concepts" },
      { title: "Philosophy", slug: "introduction/philosophy" },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      { title: "Installation", slug: "getting-started/installation" },
      { title: "Authentication", slug: "getting-started/authentication" },
      { title: "Quick Start", slug: "getting-started/quickstart" },
      { title: "Configuration", slug: "getting-started/configuration" },
    ],
  },
  {
    id: "agents",
    title: "Agents",
    items: [
      { title: "Chat Agent", slug: "agents/chat" },
      { title: "Tool Calling Agent", slug: "agents/tool-calling" },
      { title: "Application Agent", slug: "agents/application" },
      { title: "Explorer Agent", slug: "agents/explorer" },
    ],
  },
  {
    id: "tools",
    title: "Tools Reference",
    items: [
      { title: "List Directory", slug: "tools/list-directory" },
      { title: "Search Files", slug: "tools/search-files" },
      { title: "Read File", slug: "tools/read-file" },
      { title: "Google Search", slug: "tools/google-search" },
      { title: "Code Execution", slug: "tools/code-execution" },
      { title: "URL Context", slug: "tools/url-context" },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    items: [
      { title: "System Overview", slug: "architecture/overview" },
      { title: "Agent Execution Loop", slug: "architecture/agent-loop" },
      { title: "Tool System", slug: "architecture/tool-system" },
      { title: "Authentication Flow", slug: "architecture/auth-flow" },
      { title: "Workspace Security", slug: "architecture/workspace-security" },
    ],
  },
  {
    id: "cli",
    title: "CLI Reference",
    items: [
      { title: "cognivex login", slug: "cli/login" },
      { title: "cognivex logout", slug: "cli/logout" },
      { title: "cognivex whoami", slug: "cli/whoami" },
      { title: "cognivex wakeup", slug: "cli/wakeup" },
    ],
  },
  {
    id: "security",
    title: "Security",
    items: [
      { title: "Security Model & Boundaries", slug: "security/model" },
    ],
  },
];

export function getAllNavItems(): (NavItem & { groupTitle: string; groupId: string })[] {
  return NAV.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      groupTitle: group.title,
      groupId: group.id,
    }))
  );
}

export function getPrevNext(slug: string): {
  prev: (NavItem & { groupTitle: string }) | null;
  next: (NavItem & { groupTitle: string }) | null;
} {
  const allItems = getAllNavItems();
  const currentIndex = allItems.findIndex((item) => item.slug === slug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const next = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return { prev, next };
}
