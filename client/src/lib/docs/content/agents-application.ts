import { DocPage } from "../types";

export const agentsApplicationPage: DocPage = {
  slug: "agents/application",
  group: "agents",
  title: "Application Agent",
  description: "Scaffold complete, production-ready applications from natural language prompts.",
  blocks: [
    {
      type: "paragraph",
      text: "The Application Agent generates entire software projects from a single descriptive prompt. It produces complete folder hierarchies, boilerplate files, configuration files, and setup scripts.",
    },
    {
      type: "heading",
      level: 2,
      id: "architecture",
      text: "Architecture: Single-Shot Structured Generation",
    },
    {
      type: "paragraph",
      text: "The Application Agent is not an iterative agent loop. Instead, it performs a single `generateObject` call using a strict Zod schema to produce the entire application specification in one structured JSON output.",
    },
    {
      type: "heading",
      level: 2,
      id: "schema",
      text: "Application Schema Definition",
    },
    {
      type: "code",
      lang: "typescript",
      label: "agent.config.js Schema",
      code: `const applicationSchema = z.object({
  folderName: z.string().describe("kebab-case folder name for the application"),
  description: z.string().describe("Brief description of what was created"),
  files: z.array(
    z.object({
      path: z.string().describe("Relative File Path (e.g src/App.jsx)"),
      content: z.string().describe("Complete file content"),
    })
  ),
  setupCommands: z.array(
    z.string().describe("Bash command to setup and run (e.g npm install, npm run dev)")
  ),
  dependencies: z.record(z.string()).optional(),
});`,
    },
    {
      type: "heading",
      level: 2,
      id: "disk-writing-safety",
      text: "Filesystem Writing & User Confirmation",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Direct Disk Writes",
      text: "Files are written directly into a newly created subfolder in the current working directory (`process.cwd()`). Users are prompted to confirm before files are written to disk.",
    },
    {
      type: "heading",
      level: 2,
      id: "generation-flow",
      text: "Generation Lifecycle",
    },
    {
      type: "flow",
      steps: [
        "User enters application description in CLI prompt",
        "generateObject called with applicationSchema and comprehensive system prompts",
        "Generated file tree and metadata previewed in terminal",
        "Confirmation requested from user",
        "createApplicationFiles creates directory and writes every file asynchronously",
        "Setup commands displayed in terminal",
        "User prompted whether to generate another application",
      ],
      caption: "Application Agent execution sequence",
    },
  ],
};
