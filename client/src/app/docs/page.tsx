import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Compass, Wrench, Sparkles, Shield, Cpu } from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocRenderer } from "@/components/docs/DocRenderer";
import { DocBlock } from "@/lib/docs/types";

const flowBlock: DocBlock = {
  type: "flow",
  steps: [
    "User Request submitted in Terminal",
    "Cognivex Agent analyzes context and selects action",
    "Action executed against Tool (Filesystem, Gemini Native Tools, Structured Generator)",
    "Execution Result returned to Agent Loop",
    "Agent verifies output & produces Final Response",
  ],
  caption: "Standard execution cycle for Cognivex interactions",
};

const quickLinks = [
  {
    title: "Explorer Agent",
    description: "Autonomous workspace exploration that inspects, searches, and reads files with zero hallucinations.",
    slug: "agents/explorer",
    icon: <Compass className="h-5 w-5 text-emerald-500" />,
  },
  {
    title: "Tool Calling",
    description: "Chat augmented with native Gemini tools (Google Search, Python execution, and URL context).",
    slug: "agents/tool-calling",
    icon: <Wrench className="h-5 w-5 text-sky-500" />,
  },
  {
    title: "Application Agent",
    description: "Single-shot scaffolding agent that generates complete, production-ready project structures.",
    slug: "agents/application",
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
  },
  {
    title: "CLI Reference",
    description: "Detailed guide for cognivex login, logout, whoami, and wakeup commands.",
    slug: "cli/wakeup",
    icon: <Terminal className="h-5 w-5 text-amber-500" />,
  },
  {
    title: "Architecture",
    description: "Understand the layered execution loops, path safety bounds, and authentication mechanics.",
    slug: "architecture/overview",
    icon: <Cpu className="h-5 w-5 text-indigo-500" />,
  },
  {
    title: "Security Model",
    description: "Workspace containment, sensitive credential filtering, and safety limiters.",
    slug: "security/model",
    icon: <Shield className="h-5 w-5 text-rose-500" />,
  },
];

export default function DocsLandingPage() {
  return (
    <div className="max-w-4xl space-y-12">
      {/* Hero Header */}
      <div className="space-y-4 border-b border-zinc-200 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Cognitive Autonomous Agent
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Cognivex Documentation
        </h1>

        <p className="text-lg font-medium text-emerald-600">
          Understand. Decide. Execute.
        </p>

        <p className="text-base text-zinc-600 leading-7">
          Cognivex is a cognitive autonomous CLI agent designed for developers who live in the terminal. It provides direct access to generative AI capabilities, iterative filesystem inspection, structured application scaffolding, and external tools right from your command line.
        </p>
      </div>

      {/* Quick Start Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Quick Start
        </h2>
        <p className="text-sm text-zinc-600">
          Install dependencies, link the binary, authenticate via GitHub Device OAuth, and start the interactive wakeup menu:
        </p>

        <CodeBlock
          lang="bash"
          label="Terminal Installation"
          code={`npm install
npm link
cognivex login
cognivex wakeup`}
        />
      </div>

      {/* Execution Flow Diagram */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Agent Execution Architecture
        </h2>
        <p className="text-sm text-zinc-600">
          All Cognivex agents adhere to strict validation and execution flows grounded directly in your local workspace:
        </p>

        <DocRenderer blocks={[flowBlock]} />
      </div>

      {/* Quick Links Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Explore the Documentation
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.slug}
              href={`/docs/${link.slug}`}
              className="group rounded-xl border border-zinc-200 bg-zinc-50/30 p-5 transition-all hover:border-emerald-500/50 hover:bg-zinc-50 hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-2 border border-zinc-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                  {link.icon}
                </div>
                <h3 className="font-semibold text-base text-zinc-900 group-hover:text-emerald-600 transition-colors">
                  {link.title}
                </h3>
              </div>
              <p className="mt-2.5 text-xs text-zinc-500 leading-relaxed">
                {link.description}
              </p>
              <div className="mt-3 flex items-center text-xs font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Read guide</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
