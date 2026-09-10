import { DocPage } from "../types";

export const introductionPages: DocPage[] = [
  {
    slug: "introduction/overview",
    group: "introduction",
    title: "Overview",
    description: "Learn what Cognivex is and how it empowers terminal-first AI development.",
    blocks: [
      {
        type: "paragraph",
        text: "Cognivex is a cognitive autonomous CLI agent designed for developers who live in the terminal. It provides direct access to generative AI capabilities, iterative filesystem inspection, structured application scaffolding, and external tools right from your command line.",
      },
      {
        type: "callout",
        tone: "success",
        title: "Understand. Decide. Execute.",
        text: "Cognivex operates directly against your local workspace, analyzing structure, executing tools, and producing answers without leaving your development environment.",
      },
      {
        type: "heading",
        level: 2,
        id: "core-capabilities",
        text: "Core Capabilities",
      },
      {
        type: "paragraph",
        text: "Cognivex provides four distinct operational modes accessible via the interactive wakeup menu:",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Chat Mode: Free-form conversational streaming powered by the AI SDK with full context management.",
          "Tool Calling Mode: Chat augmented with native Google Gemini tools (Google Search, Python Code Execution, and URL Context).",
          "Application Agent: Single-shot scaffolding agent that generates complete, production-ready project structures from natural language requirements.",
          "Explorer Agent: An autonomous, iterative workspace exploration agent that inspects files, searches paths, and reads project code to answer questions grounded in actual code.",
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "how-it-works",
        text: "High-Level Architecture Flow",
      },
      {
        type: "flow",
        steps: [
          "User Request submitted in Terminal",
          "Cognivex Agent analyzes context and decides action",
          "Action executed against Tool (Filesystem, Gemini Native Tools, Structured Generator)",
          "Execution Result returned to Agent Loop",
          "Final Response streamed or written to Terminal",
        ],
        caption: "Standard execution cycle for Cognivex interactions",
      },
      {
        type: "heading",
        level: 2,
        id: "design-principles",
        text: "Design Principles",
      },
      {
        type: "table",
        headers: ["Principle", "Description"],
        rows: [
          ["Terminal Native", "Designed to run seamlessly in existing shell workflows and CI/CD environments."],
          ["Strict Safety Boundaries", "Filesystem inspection is scoped to the workspace root with traversal protections and size limits."],
          ["Grounded Responses", "Agents prioritize actual file contents and structured tool outputs over model hallucinations."],
          ["Explicit Execution", "Destructive or write actions require explicit user confirmation before touching the disk."],
        ],
      },
    ],
  },
  {
    slug: "introduction/concepts",
    group: "introduction",
    title: "Core Concepts",
    description: "Understand the fundamental concepts behind Cognivex's agent architecture.",
    blocks: [
      {
        type: "paragraph",
        text: "To make effective use of Cognivex, it is helpful to understand the underlying conceptual pillars of its architecture.",
      },
      {
        type: "heading",
        level: 2,
        id: "modes-and-agents",
        text: "Modes and Agents",
      },
      {
        type: "paragraph",
        text: "Cognivex distinguishes between streaming conversational modes and goal-directed autonomous agents:",
      },
      {
        type: "keyvalue",
        items: [
          { label: "Interactive Session", value: "A stateful CLI process initiated with `cognivex wakeup`." },
          { label: "Explorer Loop", value: "A multi-step autonomous loop bounded by a maximum step count (10 steps)." },
          { label: "Tool Schema", value: "Zod-validated parameters defining strict inputs and outputs for agent actions." },
          { label: "Device Auth", value: "OAuth-based Device Authorization flow storing credentials in `~/.better-auth/token.json`." },
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "workspace-scoping",
        text: "Workspace Scoping",
      },
      {
        type: "paragraph",
        text: "When you run `cognivex wakeup`, Cognivex identifies the current working directory (`process.cwd()`) as the workspace root. All filesystem exploration tools resolve paths relative to this directory.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Workspace Root",
        text: "All file operations are confined within the workspace boundary. Attempts to traverse above the root or access sensitive ignored files (such as `.env`) are rejected immediately.",
      },
    ],
  },
  {
    slug: "introduction/philosophy",
    group: "introduction",
    title: "Philosophy",
    description: "The architectural philosophy and design guidelines shaping Cognivex.",
    blocks: [
      {
        type: "paragraph",
        text: "Cognivex was built with a clear ethos: developers should not have to leave their terminal or upload sensitive repositories to third-party web interfaces just to get intelligent code assistance.",
      },
      {
        type: "heading",
        level: 2,
        id: "transparency",
        text: "Transparency and Truth in Grounding",
      },
      {
        type: "paragraph",
        text: "An AI agent is only as good as the factual accuracy of its inspection. When Cognivex analyzes your code, it performs real filesystem queries (`readdir`, `stat`, `readFile`) before forming opinions.",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "No Hallucinated File Paths: The agent only references files discovered through actual filesystem tools.",
          "Verifiable Steps: In Explorer mode, each step outputs its reasoning and executed action directly in the CLI.",
          "Minimalist Dependencies: Built with lightweight CLI primitives, strict Zod validation, and modern AI SDK integrations.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Read-Only Exploration",
        text: "Explorer agent is strictly read-only. It inspects, reads, and navigates, but does not mutate existing files without your explicit direction via dedicated creation workflows.",
      },
    ],
  },
];
