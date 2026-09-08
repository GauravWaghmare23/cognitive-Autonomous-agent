# ARC — Adaptive Reasoning & Code Intelligence Runtime Engine

<div align="center">
  <h3><strong>The futuristic, AI-powered CLI and Device Management Platform.</strong></h3>
  <p>A unified system featuring a powerful command-line interface paired with an aesthetic, 3D interactive Next.js dashboard.</p>
</div>

---

## 🚀 Overview

**Arc** is a dual-component platform designed to bridge local terminal workflows with a sleek, futuristic web dashboard. It enables secure device authorization, AI-powered terminal assistance, and seamless interaction between your local machine and cloud environment.

### Components
1. **Arc CLI (Server)**: A Node.js based command-line tool (`arc`) featuring device authentication, AI assistance (Google AI SDK), and terminal enhancements.
2. **Arc Dashboard (Client)**: A stunning, futuristic Next.js application with 3D interactions, micro-animations, and glassmorphism design. It handles user authentication, device management (approvals/denials), and provides a central hub for your Arc ecosystem.

---

## ✨ Features

### 🖥️ Dashboard (Client)
- **Cinematic UI/UX**: Built with React 19 and Tailwind CSS, featuring smooth micro-animations, 3D perspective tilts, and an immersive "dark space" aesthetic.
- **Advanced Auth Flows**: Secure login and registration powered by `better-auth`, wrapped in beautiful Aurora gradient backgrounds.
- **Device Management**: Real-time device approval workflows with interactive glyph-scanning animations and status tracking.
- **Glassmorphism Design**: Custom `GlobalFX` primitives including `GlassCard`, `GlowOrbs`, and `GridBackdrop`.

### ⌨️ CLI (Server)
- **Interactive Terminal**: Beautiful terminal UI using `chalk`, `boxen`, `ora`, and `yocto-spinner`.
- **AI Integration**: Built-in Google AI SDK for smart terminal assistance and command generation.
- **Secure Device Auth**: Prompts for device verification seamlessly linked to the web dashboard.
- **Local Server**: Express-based backend with Prisma ORM for robust data management.

---

## 🛠️ Tech Stack

### Client (Web Dashboard)
- **Framework**: Next.js 16, React 19
- **Styling**: Tailwind CSS v4, custom CSS utilities
- **UI Components**: Shadcn UI, Base UI, Lucide React
- **Authentication**: Better Auth
- **Animations**: TW Animate CSS, custom keyframes

### Server & CLI
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database / ORM**: Prisma Client
- **CLI Utilities**: Commander, Inquirer, Clack Prompts, Chalk, Figlet
- **AI**: @ai-sdk/google, Vercel AI SDK
- **Authentication**: Better Auth

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
│   ├── src/cli/            # Arc CLI implementation (main.js)
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
- A PostgreSQL/MySQL database (for Prisma)
- Google AI API Key (for CLI features)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/arc.git
cd arc
```

### 2. Setup Server / CLI
```bash
cd server
npm install

# Setup your environment variables (.env)
# DATABASE_URL="..."
# GOOGLE_GENERATIVE_AI_API_KEY="..."

# Run Prisma migrations
npx prisma db push

# Link the CLI globally (optional, to use the `arc` command anywhere)
npm link

# Start the dev server
npm run dev
```

### 3. Setup Client (Dashboard)
```bash
# In a new terminal window
cd client
npm install

# Setup your environment variables (.env)
# NEXT_PUBLIC_API_URL="http://localhost:3000"

# Start the Next.js development server
npm run dev
```

---

## 💻 Usage

### Web Dashboard
Navigate to `http://localhost:3000` (or your configured port) to access the Arc landing page. Sign in or register to access the dashboard and manage your connected devices.

### Arc CLI
If linked globally, simply run:
```bash
arc --help
```
Follow the interactive prompts to authenticate your device. This will trigger an approval flow on your web dashboard. Once approved, you can utilize the AI-powered CLI features.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ and a vision for the future.</p>
</div>
