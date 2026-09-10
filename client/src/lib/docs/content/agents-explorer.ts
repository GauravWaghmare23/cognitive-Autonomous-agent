import { DocPage } from "../types";

export const agentsExplorerPage: DocPage = {
  slug: "agents/explorer",
  group: "agents",
  title: "Explorer Agent",
  description: "Autonomous, iterative workspace exploration grounded in your actual codebase files.",
  blocks: [
    {
      type: "paragraph",
      text: "The Explorer Agent is Cognivex's true iterative autonomous agent. It inspects directory trees, searches for files by name, and reads file contents to answer complex questions about your workspace with zero hallucinations.",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Strictly Read-Only (Correction to Menu Hint Text)",
      text: "While the CLI menu hint text reads 'Explore, read, create and modify workspace files', this is aspirational. In the actual implementation, Explorer Agent is strictly read-only. There are no create, edit, or delete actions in its schema.",
    },
    {
      type: "heading",
      level: 2,
      id: "agent-loop",
      text: "Iterative Execution Loop",
    },
    {
      type: "paragraph",
      text: "The Explorer Agent runs an iterative loop bounded by a maximum step count (`explorerConfig.maxSteps = 10`):",
    },
    {
      type: "flow",
      steps: [
        "User submits workspace exploration query",
        "generateExplorerAction() asks LLM for next Zod-validated action",
        "Matching local tool is executed safely inside workspace boundary",
        "Tool output appended to conversation context",
        "Loop repeats up to 10 steps until 'finish' action is emitted",
        "Final user-facing response rendered to terminal",
      ],
      caption: "Explorer Agent Multi-Step Loop",
    },
    {
      type: "heading",
      level: 2,
      id: "action-schema",
      text: "Supported Actions",
    },
    {
      type: "table",
      headers: ["Action", "Parameters", "Behavior"],
      rows: [
        ["list_directory", "`path` (default: '.')", "Lists immediate entries, filtering ignored files/dirs, sorted dirs first."],
        ["search_files", "`query` (required), `path` (default: '.')", "Recursively searches file names (case-insensitive substring match). Capped at 100 results."],
        ["read_file", "`path` (required)", "Reads full file text if size <= 1 MB (1,048,576 bytes)."],
        ["finish", "`reason`, `response` (required)", "Terminates the loop and delivers the final response string to the user."],
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "boundary-safety",
      text: "Workspace Boundaries & Ignored Assets",
    },
    {
      type: "paragraph",
      text: "The agent workspace root is resolved to `process.cwd()`. All path requests are normalized and checked for path traversal (`..` escape checks).",
    },
    {
      type: "keyvalue",
      items: [
        { label: "Ignored Directories", value: "`node_modules`, `.git`, `.next`, `dist`, `build`, `coverage`" },
        { label: "Ignored Files (Exact)", value: "`.env`, `.env.local`, `.env.production`, `.env.development`" },
        { label: "Max File Read Size", value: "1,048,576 bytes (1 MB)" },
        { label: "Max Search Results", value: "100 matches" },
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "10-Step Cap",
      text: "If 10 steps pass without emitting a `finish` action, the agent gracefully terminates with an incomplete-investigation notice rather than hanging or looping infinitely.",
    },
  ],
};
