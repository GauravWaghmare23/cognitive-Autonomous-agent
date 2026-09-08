# Cognivex

**Cognitive Autonomous Agent**

Cognivex is a Cognitive Autonomous Agent designed to understand developer requests, reason about required actions, use available tools, inspect execution results, and iteratively continue until it can produce a final result.

---

## 🚀 Overview

Cognivex is a dual‑component platform that bridges local terminal workflows with a sleek, futuristic web dashboard. It enables secure device authorization, AI‑powered terminal assistance, and seamless interaction between your local machine and cloud environment.

### Components
1. **Cognivex CLI (Server)**: A Node.js based command‑line tool (`cognivex`) featuring device authentication, AI assistance (Google AI SDK), and terminal enhancements.
2. **Cognivex Dashboard (Client)**: A modern Next.js application with 3D interactions, micro‑animations, and glassmorphism design. It handles user authentication, device management, and provides a central hub for your Cognivex ecosystem.

---

## ✨ Features

### 🖥️ Dashboard (Client)
- **Cinematic UI/UX**: Built with React 19 and Tailwind CSS, featuring smooth micro‑animations, 3D perspective tilts, and an immersive dark‑space aesthetic.
- **Advanced Auth Flows**: Secure login and registration powered by `better-auth`.
- **Device Management**: Real‑time device approval workflows with interactive glyph‑scanning animations and status tracking.
- **Glassmorphism Design**: Custom `GlobalFX` primitives including `GlassCard`, `GlowOrbs`, and `GridBackdrop`.

### ⌨️ CLI (Server)
- **Interactive Terminal**: Beautiful terminal UI using `chalk`, `boxen`, `ora`, and `yocto-spinner`.
- **AI Integration**: Built‑in Google AI SDK for smart terminal assistance and command generation.
- **Secure Device Auth**: Prompts for device verification seamlessly linked to the web dashboard.
- **Local Server**: Express‑based backend with Prisma ORM for robust data management.

---

## 📂 Project Structure

```text
cli/
├── client/                 # Next.js Web Dashboard
│   ├── src/app/            # Next.js App Router (Dashboard, Device Auth, Landing)
│   ├── src/components/     # UI Components (FX, Navbars, Hero, Forms)
│   └── package.json        # Client Dependencies
│
├── server/                 # Node.js Express Server & CLI
│   ├── src/cli/            # Cognivex CLI implementation (main.js)
│   ├── src/                # Express API routes and server logic
│   ├── prisma/             # Database schema and migrations
│   └── package.json        # Server Dependencies
│
└── README.md               # You are here
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL (or compatible) database for Prisma
- Google AI API Key (for CLI features)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cognivex.git
cd cognivex
```

### 2. Setup Server / CLI
```bash
cd server
npm install

# Setup environment variables (.env)
# DATABASE_URL="..."
# GOOGLE_GENERATIVE_AI_API_KEY="..."

# Run Prisma migrations
npx prisma db push

# Link the CLI globally (optional, to use the `cognivex` command anywhere)
npm link
```

### 3. Setup Client (Dashboard)
```bash
cd client
npm install

# Setup environment variables (.env)
# NEXT_PUBLIC_API_URL="http://localhost:3000"

npm run dev
```

---

## 💻 Usage

### Web Dashboard
Navigate to `http://localhost:3000` (or your configured port) to access the Cognivex landing page. Sign in or register to manage your connected devices.

### Cognivex CLI
If linked globally, run:
```bash
cognivex --help
```
Select one of the available modes:
- **Chat** – Normal conversational interaction.
- **Tool Calling** – AI interaction with available tools (Google Search, Code Execution).
- **Application Agent** – Generates full‑stack application scaffolds.
- **Explorer Agent** – Autonomous workspace exploration (list directories, search files, read files, multi‑step investigations).

---

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📖 Current Capabilities
- **Cognivex CLI** with four operational modes (Chat, Tool Calling, Application Agent, Explorer Agent).
- **Explorer Agent** employs structured actions (`list_directory`, `search_files`, `read_file`, `finish`) with validation against a Zod schema.
- Multi‑step investigation loops with token/usage tracking.
- Secure authentication via **Better Auth**.
- PostgreSQL integration via **Prisma**.
- Workspace safety protections: root restriction, path traversal prevention, ignored directories/files, maximum file size (1 MiB), max search results (100), and query validation.

---

## 🛣️ Roadmap (Future / Planned)
- **Coding Agent** – Autonomous code generation and refactoring.
- **Testing Agent** – Automated test creation and execution.
- **Git Agent** – Version control operations.
- **Database Agent** – Schema migrations and data inspection.
- **DevOps Agent** – Deployment and CI/CD workflows.
- **Research Agent** – Literature search and summarization.
- **Documentation Agent** – Automatic docs generation.
- Persistent memory, richer tool orchestration, agent‑to‑agent workflows, execution tracing, sandbox approvals, additional workspace modification tools, connector‑based data analysis.

---

## 🏗️ Design Philosophy
Cognivex follows a reusable agent runtime pattern:
```
Agent → Action Schema → Tool Registry → Tool Execution → Observation → Agent Loop
```
New agents can reuse this architecture while defining their own tools and objectives, enabling consistent, safe, and extensible autonomous behavior.

---

## 📜 License
MIT License
