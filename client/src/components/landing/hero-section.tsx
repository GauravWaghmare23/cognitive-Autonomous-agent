import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import { GlobalFX, GridBackdrop, GlowOrbs, Spotlight, Reveal, CopyButton, PulseDot, Magnetic } from "./fx";
import { TechNetworkBackground } from "./tech-network-bg";

export function HeroSection() {
  return (
    <section className={cn('relative', 'overflow-hidden', 'px-6', 'py-28', 'md:py-36', 'lg:py-44')}>
      <GlobalFX />

      {/* Background */}
      <TechNetworkBackground />
      <GridBackdrop />
      <GlowOrbs variant="hero" />
      <Spotlight />

      <div className={cn('mx-auto', 'max-w-5xl', 'text-center')}>
        {/* Badge */}
        <Reveal>
          <div
            className={cn(
              'mb-8 inline-flex items-center gap-2.5 rounded-full border bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur',
              'transition-colors hover:border-emerald-500/30 hover:text-foreground'
            )}
          >
            <PulseDot />
            <Terminal className={cn('h-3.5', 'w-3.5')} />
            <span>AI-powered developer CLI</span>
          </div>
        </Reveal>

        {/* Heading */}
        <Reveal delay={80}>
          <h1 className={cn('text-5xl', 'font-bold', 'tracking-tight', 'sm:text-6xl', 'md:text-7xl', 'lg:text-8xl')}>
            Your terminal.
            <br />
            <span className={cn('bg-gradient-to-r', 'from-foreground', 'via-foreground', 'to-foreground/40', 'bg-clip-text', 'text-transparent')}>
              Supercharged with AI.
            </span>
          </h1>
        </Reveal>

        {/* Description */}
        <Reveal delay={160}>
          <p className={cn('mx-auto', 'mt-8', 'max-w-2xl', 'text-base', 'leading-7', 'text-muted-foreground', 'sm:text-lg', 'sm:leading-8')}>
<p className={cn('mx-auto', 'mt-8', 'max-w-2xl', 'text-base', 'leading-7', 'text-muted-foreground', 'sm:text-lg', 'sm:leading-8')}>Cognivex brings AI directly into your terminal.</p>
            Understand your code, debug problems, automate
            repetitive tasks, and build faster without leaving
            your development environment.
          </p>
        </Reveal>

        {/* Actions */}
        <Reveal delay={240}>
          <div className={cn('mt-10', 'flex', 'flex-col', 'items-center', 'justify-center', 'gap-3', 'sm:flex-row')}>
            <Magnetic className={cn('w-full', 'sm:w-auto')}>
              <Button size="lg" className={cn('group', 'w-full', 'sm:w-auto')}>
                <Link href="/register" className={cn('flex', 'items-center')}>
                  Get started
                  <ArrowRight className={cn('ml-2', 'h-4', 'w-4', 'transition-transform', 'group-hover:translate-x-1')} />
                </Link>
              </Button>
            </Magnetic>

            <Magnetic strength={0.25} className={cn('w-full', 'sm:w-auto')}>
              <Button size="lg" variant="outline" className={cn('w-full', 'sm:w-auto')}>
                <Link href="/docs">Read the docs</Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal>

        {/* Install command */}
        <Reveal delay={320}>
          <div
            className={cn(
              'group mx-auto mt-10 flex w-fit items-center gap-3 rounded-lg border bg-muted/50 py-3 pl-4 pr-2 font-mono text-sm',
              'transition-colors hover:border-emerald-500/30 hover:bg-muted/70'
            )}
          >
            <span className={cn('text-emerald-600')}>$</span>
            <span>npm install -g arc-cli</span>
            <CopyButton
              value="npm install -g arc-cli"
              className={cn('text-muted-foreground/60', 'hover:bg-foreground/5', 'hover:text-foreground')}
            />
          </div>
        </Reveal>

        {/* Supporting text */}
        <Reveal delay={380}>
          <p className={cn('mt-4', 'text-xs', 'text-muted-foreground')}>
            Built for developers who live in the terminal.
          </p>
        </Reveal>
      </div>
    </section>
  );
}