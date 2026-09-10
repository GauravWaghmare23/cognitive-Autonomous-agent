import { DocPage } from "../types";

export const toolsReadFilePage: DocPage = {
  slug: "tools/read-file",
  group: "tools",
  title: "Read File",
  description: "Read the UTF-8 text contents of a target file within the workspace.",
  blocks: [
    {
      type: "paragraph",
      text: "The `read_file` tool enables the Explorer Agent to read the contents of discovered files to answer queries with actual source code grounding.",
    },
    {
      type: "heading",
      level: 2,
      id: "parameters",
      text: "Parameters",
    },
    {
      type: "table",
      headers: ["Parameter", "Type", "Required", "Description"],
      rows: [
        ["path", "string", "Yes", "Relative path to the file to be read."],
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "safety-and-validation",
      text: "Safety & Validation Checks",
    },
    {
      type: "paragraph",
      text: "Before reading, `read_file` applies multiple checks:",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Path Traversal Check: Rejects paths resolving outside the workspace root.",
        "Ignored File Name Check: Explicitly rejects reading `.env`, `.env.local`, `.env.production`, or `.env.development` with 'Access denied: file is ignored'.",
        "File Type Check: Uses `fs.stat()` to confirm the path is a file (throws if given a directory).",
        "Max File Size Check: Throws an error ('File is too large') if the file size exceeds `explorerConfig.limits.maxFileSize` (1,048,576 bytes / 1 MB).",
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
      label: "read_file output",
      code: `{
  "name": "package.json",
  "path": "package.json",
  "type": "file",
  "size": 1064,
  "content": "{\\n  \\"name\\": \\"arc-cli\\",\\n  ..."
}`,
    },
  ],
};
