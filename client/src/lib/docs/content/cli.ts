import { DocPage } from "../types";

export const cliPages: DocPage[] = [
  {
    slug: "cli/login",
    group: "cli",
    title: "cognivex login",
    description: "Authenticate the CLI client using GitHub OAuth Device Flow.",
    blocks: [
      {
        type: "paragraph",
        text: "The `cognivex login` command initiates the OAuth 2.0 Device Authorization flow to authenticate your terminal with your Cognivex account.",
      },
      {
        type: "heading",
        level: 2,
        id: "usage",
        text: "Usage",
      },
      {
        type: "code",
        lang: "bash",
        label: "Terminal",
        code: `cognivex login [options]`,
      },
      {
        type: "heading",
        level: 2,
        id: "options",
        text: "Options & Flags",
      },
      {
        type: "table",
        headers: ["Flag", "Description", "Default"],
        rows: [
          ["--server-url <url>", "Base URL of the authentication server", "AUTH_URL env or http://localhost:4000"],
          ["--client-id <id>", "GitHub OAuth Client ID", "GITHUB_CLIENT_ID env"],
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "workflow",
        text: "Command Workflow",
      },
      {
        type: "flow",
        steps: [
          "Check existing ~/.better-auth/token.json; if valid and unexpired, prompt to confirm re-auth",
          "Request device code and user verification code from auth server",
          "Display code and verification URL in terminal",
          "Attempt to open browser to approval URL automatically",
          "Poll authClient.device.token() until user approves or token expires",
          "Save credentials to ~/.better-auth/token.json",
        ],
        caption: "cognivex login sequence",
      },
    ],
  },
  {
    slug: "cli/logout",
    group: "cli",
    title: "cognivex logout",
    description: "Remove stored authentication tokens from the local machine.",
    blocks: [
      {
        type: "paragraph",
        text: "The `cognivex logout` command terminates your local session by deleting the persisted token file.",
      },
      {
        type: "heading",
        level: 2,
        id: "usage",
        text: "Usage",
      },
      {
        type: "code",
        lang: "bash",
        label: "Terminal",
        code: `cognivex logout`,
      },
      {
        type: "heading",
        level: 2,
        id: "behavior",
        text: "Behavior",
      },
      {
        type: "paragraph",
        text: "When invoked, the command asks for user confirmation. Upon confirmation, it deletes `~/.better-auth/token.json`. Subsequent commands requiring authentication will require logging in again.",
      },
    ],
  },
  {
    slug: "cli/whoami",
    group: "cli",
    title: "cognivex whoami",
    description: "Inspect active authentication status and current user details.",
    blocks: [
      {
        type: "paragraph",
        text: "The `cognivex whoami` command checks your current session token and prints information about the authenticated user.",
      },
      {
        type: "heading",
        level: 2,
        id: "usage",
        text: "Usage",
      },
      {
        type: "code",
        lang: "bash",
        label: "Terminal",
        code: `cognivex whoami`,
      },
      {
        type: "heading",
        level: 2,
        id: "verification-logic",
        text: "Verification Logic",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Calls `requireAuth()` to verify that a token file exists.",
          "Verifies that the token is not expired and does not expire within 5 minutes.",
          "Queries the database via Prisma using the session token.",
          "Prints the user's name, email, and user ID in the terminal.",
        ],
      },
    ],
  },
  {
    slug: "cli/wakeup",
    group: "cli",
    title: "cognivex wakeup",
    description: "Launch the interactive agent workspace menu in the current directory.",
    blocks: [
      {
        type: "paragraph",
        text: "The `cognivex wakeup` command is the main entry point to start interactive AI sessions and autonomous agents in your terminal.",
      },
      {
        type: "heading",
        level: 2,
        id: "usage",
        text: "Usage",
      },
      {
        type: "code",
        lang: "bash",
        label: "Terminal",
        code: `cognivex wakeup`,
      },
      {
        type: "heading",
        level: 2,
        id: "menu-options",
        text: "Available Menu Options",
      },
      {
        type: "table",
        headers: ["Option", "Action Description"],
        rows: [
          ["Chat", "Free-form streaming conversation with full message history."],
          ["Tool Calling", "Chat with native Google Gemini tools (Google Search, Code Execution, URL Context)."],
          ["Application Agent", "Generate complete production-ready applications with file scaffolding and setup scripts."],
          ["Explorer Agent", "Autonomous multi-step workspace exploration agent that lists, searches, and reads files."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Workspace Context",
        text: "Running `cognivex wakeup` automatically binds the Explorer and Application agents to the directory from which the command was invoked (`process.cwd()`).",
      },
    ],
  },
];
