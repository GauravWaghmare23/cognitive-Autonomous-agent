import { DocPage } from "../types";

export const securityPage: DocPage = {
  slug: "security/model",
  group: "security",
  title: "Security Model & Boundaries",
  description: "Understand Cognivex's workspace isolation, credential filtering, and execution boundaries.",
  blocks: [
    {
      type: "paragraph",
      text: "Cognivex incorporates security guardrails designed to prevent accidental leakage of sensitive files and enforce workspace boundaries during agent execution.",
    },
    {
      type: "heading",
      level: 2,
      id: "workspace-containment",
      text: "Workspace Containment",
    },
    {
      type: "paragraph",
      text: "All filesystem operations are resolved relative to the directory where `cognivex wakeup` was started (`process.cwd()`). Path traversal attempts outside this boundary are blocked before any system calls are made.",
    },
    {
      type: "callout",
      tone: "info",
      title: "Path Traversal Blocking",
      text: "The path resolver checks if relative paths contain leading `..` or resolve outside the workspace root. Note that while this blocks path traversal, it is not a kernel-level sandboxing or chroot mechanism.",
    },
    {
      type: "heading",
      level: 2,
      id: "ignored-files",
      text: "Ignored Files and Directories",
    },
    {
      type: "paragraph",
      text: "The Explorer Agent enforces explicit exclusion lists across directory inspection and file reading operations:",
    },
    {
      type: "table",
      headers: ["Category", "Filtered Items", "Matching Rule"],
      rows: [
        [
          "Ignored Files",
          "`.env`, `.env.local`, `.env.production`, `.env.development`",
          "Exact filename match only (note: custom extensions like `.env.staging` are not covered by default)"
        ],
        [
          "Ignored Directories",
          "`node_modules`, `.git`, `.next`, `dist`, `build`, `coverage`",
          "Exact directory name match anywhere in the hierarchy"
        ],
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "limits-and-quotas",
      text: "Safety Limits and Quotas",
    },
    {
      type: "keyvalue",
      items: [
        { label: "Max File Read Size", value: "1,048,576 bytes (1 MB) — larger files fail with an explicit error" },
        { label: "Max Search Results", value: "100 file entries — stops recursive search to prevent memory exhaustion" },
        { label: "Max Explorer Steps", value: "10 loop iterations — prevents infinite autonomous loops" },
      ],
    },
  ],
};
