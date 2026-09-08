"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import { GlobalFX, Reveal, CopyButton, GlowOrbs } from "./fx";

const managers = [
  { id: "npm", label: "npm", command: "npm install -g arc-cli" },
  { id: "pnpm", label: "pnpm", command: "pnpm add -g arc-cli" },
  { id: "yarn", label: "yarn", command: "yarn global add arc-cli" },
] as const;

export function InstallationSection() {
  const [active, setActive] = useState<(typeof managers)[number]["id"]>("npm");
  const current = managers.find((m) => m.id === active)!;

  return (
    <section className={cn('relative', 'border-t', 'px-6', 'py-24', 'md:py-32')}>
      <GlobalFX />
      <GlowOrbs variant="section" />

      <div className={cn('mx-auto', 'max-w-4xl', 'text-center')}>
        <Reveal>
          <p className={cn('text-sm', 'font-medium', 'text-primary')}>
            GET STARTED
          </p>

          <h2 className={cn('mt-3', 'text-3xl', 'font-bold', 'tracking-tight', 'sm:text-4xl')}>
            Install Cognivex and start building.
          </h2>

          <p className={cn('mx-auto', 'mt-4', 'max-w-2xl', 'text-base', 'leading-7', 'text-muted-foreground')}>
            Get Cognivex running in your development environment
            and bring AI assistance directly into your terminal.
          </p>
        </Reveal>

        {/* Package manager tabs + install command */}
        <Reveal delay={100}>
          <div className={cn('mx-auto', 'mt-10', 'max-w-xl', 'overflow-hidden', 'rounded-xl', 'border', 'text-left')}>
            <div className={cn('flex', 'items-center', 'gap-1', 'border-b', 'bg-muted/30', 'px-3', 'pt-3')}>
              {managers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className={cn(
                    'relative rounded-t-md px-3 py-2 font-mono text-xs transition-colors',
                    active === m.id
                      ? 'bg-background text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {m.label}
                  {active === m.id && (
                    <span className={cn('absolute', 'inset-x-0', '-bottom-px', 'h-px', 'bg-emerald-500')} />
                  )}
                </button>
              ))}
            </div>

            <div className={cn('flex', 'items-center', 'gap-3', 'bg-muted/50', 'py-4', 'pl-5', 'pr-2')}>
              <span className={cn('font-mono', 'text-sm', 'text-emerald-600')}>$</span>
              <span className={cn('flex-1', 'font-mono', 'text-sm')}>{current.command}</span>
              <CopyButton
                value={current.command}
                className={cn('text-muted-foreground/60', 'hover:bg-foreground/5', 'hover:text-foreground')}
              />
            </div>
          </div>
        </Reveal>

        {/* Verify install */}
        <Reveal delay={160}>
          <div className={cn('mx-auto', 'mt-4', 'max-w-xl', 'overflow-hidden', 'rounded-xl', 'border', 'bg-black', 'text-left', 'font-mono', 'text-sm', 'text-white')}>
            <div className={cn('px-5', 'py-4')}>
              <p className={cn('flex', 'items-center', 'gap-3')}>
                <span className="text-emerald-400">$</span>
                arc --version
              </p>

              <p className={cn('mt-2', 'text-white/50')}>
                arc v0.1.0
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className={cn('mt-8', 'flex', 'flex-col', 'items-center', 'justify-center', 'gap-3', 'sm:flex-row')}>
            <Button size="lg">
              <Link href="/register">
                Get started
              </Link>
            </Button>

            <Button size="lg" variant="outline">
              <Link href="/docs">
                View documentation
              </Link>
            </Button>
          </div>

          <p className={cn('mt-6', 'text-xs', 'text-muted-foreground')}>
            Node.js 18+ recommended
          </p>
        </Reveal>
      </div>
    </section>
  );
}