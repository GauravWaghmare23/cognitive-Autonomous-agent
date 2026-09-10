import { DocPage } from "../types";

export const toolsSearchFilesPage: DocPage = {
  slug: "tools/search-files",
  group: "tools",
  title: "Search Files",
  description: "Recursively search workspace directory trees for matching file names.",
  blocks: [
    {
      type: "paragraph",
      text: "The `search_files` tool allows the Explorer Agent to locate specific files across directory trees by filename.",
    },
    {
      type: "callout",
      tone: "info",
      title: "Filename Search Only",
      text: "This tool searches filenames using a case-insensitive substring match. It does not perform full-text search across file contents.",
    },
    {
      type: "heading",
      level: 2,
      id: "parameters",
      text: "Parameters",
    },
    {
      type: "table",
      headers: ["Parameter", "Type", "Required", "Default", "Description"],
      rows: [
        ["query", "string", "Yes", "—", "Search term matching file names (minimum 1 character, trimmed)."],
        ["path", "string", "No", "`.`", "Root directory to start searching from."],
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "limits",
      text: "Limits and Execution",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Empty Query Check: Throws an explicit error if `query` is empty or only whitespace.",
        "Result Cap: Stops recursively walking as soon as `explorerConfig.limits.maxSearchResults` (100) results are reached.",
        "Directory Skipping: Completely skips traversing into ignored directories such as `node_modules` or `.git`.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "output-format",
      text: "Output Structure",
    },
    {
      type: "code",
      lang: "json",
      label: "search_files output",
      code: `{
  "query": "config",
  "path": ".",
  "results": [
    { "name": "explorer.config.js", "path": "src/config/explorer.config.js", "type": "file" },
    { "name": "tool.config.js", "path": "src/config/tool.config.js", "type": "file" }
  ],
  "total": 2
}`,
    },
  ],
};
