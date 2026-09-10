import { DocPage } from "../types";

export const gettingStartedPages: DocPage[] = [
  {
    slug: "getting-started/installation",
    group: "getting-started",
    title: "Installation",
    description: "Install and link the Cognivex CLI for local terminal usage.",
    blocks: [
      {
        type: "paragraph",
        text: "Cognivex is distributed as a Node.js CLI tool. You can install and link it to your global path using npm.",
      },
      {
        type: "heading",
        level: 2,
        id: "install-commands",
        text: "Building and Linking",
      },
      {
        type: "paragraph",
        text: "Clone or navigate to the project directory and install the necessary dependencies, then link the CLI binary globally:",
      },
      {
        type: "code",
        lang: "bash",
        label: "Terminal",
        code: `# Install dependencies
npm install

# Link binary globally
npm link`,
      },
      {
        type: "callout",
        tone: "info",
        title: "Global Binary",
        text: "Once linked with `npm link`, the `cognivex` command becomes available globally across your shell sessions.",
      },
      {
        type: "heading",
        level: 2,
        id: "verifying-installation",
        text: "Verifying Installation",
      },
      {
        type: "paragraph",
        text: "Verify that the command is properly registered by invoking the help flag:",
      },
      {
        type: "code",
        lang: "bash",
        label: "Terminal",
        code: `cognivex --help`,
      },
      {
        type: "paragraph",
        text: "This will display the available commands: `login`, `logout`, `whoami`, and `wakeup`.",
      },
    ],
  },
  {
    slug: "getting-started/authentication",
    group: "getting-started",
    title: "Authentication",
    description: "Authenticate the CLI using GitHub OAuth Device Authorization.",
    blocks: [
      {
        type: "paragraph",
        text: "Cognivex uses Better Auth's OAuth 2.0 Device Authorization flow to link your terminal session with your user account.",
      },
      {
        type: "heading",
        level: 2,
        id: "login-flow",
        text: "Running `cognivex login`",
      },
      {
        type: "paragraph",
        text: "Execute the login command in your terminal:",
      },
      {
        type: "code",
        lang: "bash",
        label: "Terminal",
        code: `cognivex login`,
      },
      {
        type: "paragraph",
        text: "The CLI will initiate the device authorization flow with the following steps:",
      },
      {
        type: "flow",
        steps: [
          "CLI requests device authorization code from authentication server",
          "Terminal displays user verification code and verification URL",
          "Browser opens to approval page (or prompt provided to open manually)",
          "User signs in with GitHub and approves device",
          "CLI polls authClient.device.token() until authorization completes",
          "Session token saved to ~/.better-auth/token.json",
        ],
        caption: "Device Authorization Workflow",
      },
      {
        type: "heading",
        level: 2,
        id: "token-storage",
        text: "Token Storage and Location",
      },
      {
        type: "paragraph",
        text: "Upon successful authorization, token data is serialized to your user directory at:",
      },
      {
        type: "code",
        lang: "json",
        label: "~/.better-auth/token.json",
        code: `{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "scope": "...",
  "expires_at": 1741600000,
  "created_at": 1741500000
}`,
      },
      {
        type: "callout",
        tone: "warning",
        title: "Active Session Expiry",
        text: "If you run `cognivex login` while already logged in with a valid, non-expired token, the CLI will prompt for confirmation before re-authenticating.",
      },
    ],
  },
  {
    slug: "getting-started/quickstart",
    group: "getting-started",
    title: "Quick Start",
    description: "Your first steps with Cognivex wakeup and agent modes.",
    blocks: [
      {
        type: "paragraph",
        text: "Once authenticated, you can launch Cognivex in any project workspace using the wakeup command.",
      },
      {
        type: "heading",
        level: 2,
        id: "launching-wakeup",
        text: "Launching Cognivex",
      },
      {
        type: "code",
        lang: "bash",
        label: "Terminal",
        code: `# Navigate to your project directory
cd my-project

# Launch Cognivex
cognivex wakeup`,
      },
      {
        type: "paragraph",
        text: "The CLI checks that your token file exists, resolves your profile via Postgres/Prisma, and presents the interactive mode selection prompt:",
      },
      {
        type: "code",
        lang: "text",
        label: "CLI Menu",
        code: `? Select Mode:
  ❯ Chat
    Tool Calling
    Application Agent
    Explorer Agent`,
      },
      {
        type: "heading",
        level: 2,
        id: "mode-summary",
        text: "Selecting Your Mode",
      },
      {
        type: "table",
        headers: ["Mode", "Best For", "Tooling"],
        rows: [
          ["Chat", "General programming queries and refactoring advice", "Pure LLM stream"],
          ["Tool Calling", "Current events, calculations, web analysis", "Google Search, Code Exec, URL Context"],
          ["Application Agent", "Scaffolding full apps from scratch", "Structured Zod file generator"],
          ["Explorer Agent", "Investigating existing codebase and files", "List dir, Search files, Read file"],
        ],
      },
    ],
  },
  {
    slug: "getting-started/configuration",
    group: "getting-started",
    title: "Configuration",
    description: "Environment variables, defaults, and workspace settings.",
    blocks: [
      {
        type: "paragraph",
        text: "Cognivex configuration is driven by environment variables and default workspace boundaries.",
      },
      {
        type: "heading",
        level: 2,
        id: "environment-variables",
        text: "Environment Variables",
      },
      {
        type: "table",
        headers: ["Variable", "Default Value", "Description"],
        rows: [
          ["AUTH_URL", "http://localhost:4000", "Base URL for the authentication and API server"],
          ["GITHUB_CLIENT_ID", "(unset)", "OAuth Client ID used during device login flow"],
        ],
      },
      {
        type: "heading",
        level: 2,
        id: "cli-flags",
        text: "CLI Override Flags",
      },
      {
        type: "paragraph",
        text: "You can override connection parameters directly when running `cognivex login`:",
      },
      {
        type: "code",
        lang: "bash",
        label: "Terminal",
        code: `cognivex login --server-url https://auth.yourdomain.com --client-id your-github-client-id`,
      },
      {
        type: "callout",
        tone: "info",
        title: "Workspace Boundaries",
        text: "Workspace boundaries are determined dynamically by `process.cwd()` when Cognivex starts. You do not need to configure a static project path in config files.",
      },
    ],
  },
];
