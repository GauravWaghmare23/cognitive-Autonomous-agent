import { DocPage } from "../types";

export const toolsListDirectoryPage: DocPage = {
  slug: "tools/list-directory",
  group: "tools",
  title: "List Directory",
  description: "Inspect immediate files and folders within a target workspace path.",
  blocks: [
    {
      type: "paragraph",
      text: "The `list_directory` tool is a built-in filesystem inspection tool used by the Explorer Agent to examine immediate directory contents.",
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
        ["path", "string", "No", "`.`", "Target directory relative to the workspace root."],
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "behavior",
      text: "Behavior and Filtering",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Path Resolution: Resolves relative to `process.cwd()` using `resolveWorkspacePath()`.",
        "Security: Rejects any relative path that begins with `..` or resolves outside the workspace root.",
        "Ignored Items: Automatically omits ignored directories (`node_modules`, `.git`, `.next`, `dist`, `build`, `coverage`) and sensitive env files (`.env`, `.env.local`, `.env.production`, `.env.development`).",
        "Sorting: Entries are sorted with directories first, then alphabetically by name.",
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
      label: "list_directory output",
      code: `{
  "path": "src",
  "entries": [
    { "name": "components", "type": "directory" },
    { "name": "lib", "type": "directory" },
    { "name": "index.ts", "type": "file" }
  ],
  "total": 3
}`,
    },
  ],
};
