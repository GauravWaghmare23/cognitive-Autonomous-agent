import { DocPage } from "../types";

export const architecturePages: DocPage[] = [
  {
    slug: "architecture/overview",
    group: "architecture",
    title: "System Overview",
    description: "High-level overview of Cognivex's modular CLI architecture.",
    blocks: [
      {
        type: "paragraph",
        text: "Cognivex is architected as a modular CLI client communicating with Google Gemini AI models and an authentication/backend service.",
      },
      {
        type: "heading",
        level: 2,
        id: "component-diagram",
        text: "System Components",
      },
      {
        type: "flow",
        steps: [
          "CLI Layer (Commander.js, Inquirer prompts, Chalk)",
          "Authentication Subsystem (Better Auth Device Flow, Prisma Session lookup)",
          "Agent Dispatcher (Chat, Tool Calling, Application Agent, Explorer Agent)",
          "Filesystem Engine & Safety Guard (safe path resolution, ignore filters, size caps)",
          "AI Provider Integration (Vercel AI SDK + @ai-sdk/google)",
        ],
        caption: "Layered System Architecture",
      },
      {
        type: "heading",
        level: 2,
        id: "design-goals",
        text: "Architectural Goals",
      },
      {
        type: "table",
        headers: ["Goal", "Mechanism"],
        rows: [
          ["Fast Startup", "Lightweight entry point with lazy-loaded tool definitions and zero heavy daemons."],
          ["Strict Grounding", "Zod-validated tool contracts that feed real workspace filesystem data back to the model."],
          ["Predictable Execution", "Clear separation between single-shot generation (App Agent) and multi-step investigation (Explorer)."],
        ],
      },
    ],
  },
  {
    slug: "architecture/agent-loop",
    group: "architecture",
    title: "Agent Execution Loop",
    description: "How the Explorer Agent plans, executes tools, and terminates.",
    blocks: [
      {
        type: "paragraph",
        text: "The Explorer Agent is the only multi-step iterative loop in the codebase. It orchestrates prompt inspection, tool selection, parameter validation, and result accumulation.",
      },
      {
        type: "heading",
        level: 2,
        id: "loop-lifecycle",
        text: "Loop Lifecycle",
      },
      {
        type: "flow",
        steps: [
          "Step Counter initialized to 1 (max 10)",
          "generateExplorerAction() asks model for next action conforming to Zod schema",
          "If action is 'finish': return response string to user and exit loop",
          "Execute chosen tool (list_directory, search_files, read_file)",
          "Format result into JSON and append as observation in history",
          "Increment step counter; if counter > 10, exit with incomplete warning",
        ],
        caption: "10-Step Execution Loop Diagram",
      },
      {
        type: "heading",
        level: 2,
        id: "schema-enforcement",
        text: "Schema Enforcement",
      },
      {
        type: "paragraph",
        text: "Action generation utilizes `z.discriminatedUnion('action', ...)` to ensure that the model cannot generate malformed action parameters.",
      },
    ],
  },
  {
    slug: "architecture/tool-system",
    group: "architecture",
    title: "Tool System",
    description: "Built-in filesystem tools vs cloud-hosted Gemini tools.",
    blocks: [
      {
        type: "paragraph",
        text: "Cognivex divides tools into two distinct categories: local workspace inspection tools and cloud-hosted model tools.",
      },
      {
        type: "heading",
        level: 2,
        id: "tool-types",
        text: "Tool Categories",
      },
      {
        type: "table",
        headers: ["Category", "Tools", "Execution Context"],
        rows: [
          ["Local Workspace Tools", "list_directory, search_files, read_file", "Local Node.js runtime with direct filesystem access."],
          ["Native Cloud Tools", "google_search, code_execution, url_context", "Executed in Google's cloud infrastructure by Gemini."],
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "extensibility",
        text: "Tool Registry Pattern",
      },
      {
        type: "paragraph",
        text: "Local tools are instantiated per session via `createExplorerTools()`, binding to the current workspace root and applying configuration limits dynamically.",
      },
    ],
  },
  {
    slug: "architecture/auth-flow",
    group: "architecture",
    title: "Authentication Flow",
    description: "OAuth Device Authorization grant mechanics and token persistence.",
    blocks: [
      {
        type: "paragraph",
        text: "Authentication is handled through Better Auth's Device Authorization grant, tailored specifically for headless and terminal clients.",
      },
      {
        type: "heading",
        level: 2,
        id: "auth-sequence",
        text: "Device Authorization Sequence",
      },
      {
        type: "flow",
        steps: [
          "CLI makes POST request to /api/auth/device/code",
          "Server returns device_code, user_code, verification_uri, and interval",
          "CLI displays user_code and launches browser to verification_uri",
          "User signs in with GitHub on the web client",
          "CLI polls /api/auth/device/token at specified interval",
          "On approval, server issues access and refresh tokens",
          "CLI saves tokens to ~/.better-auth/token.json",
        ],
        caption: "Device Flow Protocol Sequence",
      },
      {
        type: "heading",
        level: 2,
        id: "session-validation",
        text: "Session Validation",
      },
      {
        type: "paragraph",
        text: "Commands requiring verified user identity (like `cognivex whoami`) query Postgres via Prisma using the session token to verify user existence and check expiration timestamps.",
      },
    ],
  },
  {
    slug: "architecture/workspace-security",
    group: "architecture",
    title: "Workspace Security",
    description: "Path isolation, ignore lists, and resource limiters.",
    blocks: [
      {
        type: "paragraph",
        text: "Cognivex enforces strict workspace boundaries to protect sensitive developer credentials and system files from unintended model exposure.",
      },
      {
        type: "heading",
        level: 2,
        id: "path-resolution",
        text: "Safe Path Resolution",
      },
      {
        type: "code",
        lang: "javascript",
        label: "Path Resolution Function",
        code: `function resolveWorkspacePath(targetPath = ".") {
  const workspaceRoot = path.resolve(explorerConfig.workspace.root);
  const resolvedPath = path.resolve(workspaceRoot, targetPath);
  const relativePath = path.relative(workspaceRoot, resolvedPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Access denied: path is outside the workspace.");
  }

  return resolvedPath;
}`,
      },
      {
        type: "heading",
        level: 2,
        id: "ignore-filters",
        text: "Ignore Filters & Guards",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Exact Name Filtering: Specifically excludes `.env`, `.env.local`, `.env.production`, and `.env.development`.",
          "Directory Skipping: Completely omits build artifacts and package dependencies (`node_modules`, `.git`, `.next`, `dist`, `build`, `coverage`).",
          "File Size Cap: Rejects reading any file larger than 1 MB (1,048,576 bytes) to prevent out-of-memory errors and context saturation.",
        ],
      },
    ],
  },
];
