import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import { GlobalFX, GridBackdrop, GlowOrbs, Reveal, Magnetic } from "./fx";

export function CTASection() {
  return (
    <section className={cn('relative', 'overflow-hidden', 'border-t', 'px-6', 'py-24', 'md:py-32')}>
      <GlobalFX />
      <GridBackdrop className="opacity-60" />
      <GlowOrbs variant="section" />

      <div className={cn('relative', 'mx-auto', 'max-w-3xl', 'text-center')}>
        <Reveal>
          <p className={cn('text-sm', 'font-medium', 'text-primary')}>
            GET STARTED WITH COGNIVEX
          </p>

          <h2 className={cn('mt-3', 'text-3xl', 'font-bold', 'tracking-tight', 'sm:text-4xl')}>
            Build faster from your terminal.
          </h2>

          <p className={cn('mx-auto', 'mt-4', 'max-w-2xl', 'text-base', 'leading-7', 'text-muted-foreground')}>
            Create your Cognivex account, connect your development
            workflow, and start using AI where you already build.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className={cn('mt-8', 'flex', 'flex-col', 'items-center', 'justify-center', 'gap-3', 'sm:flex-row')}>
            <Magnetic className={cn('w-full', 'sm:w-auto')}>
              <Button size="lg" className={cn('group', 'relative', 'w-full', 'overflow-hidden', 'sm:w-auto')}>
                <Link href="/register" className={cn('flex', 'items-center')}>
                  Get started
                  <ArrowRight className={cn('ml-2', 'h-4', 'w-4', 'transition-transform', 'group-hover:translate-x-1')} />
                </Link>
                <span
                  aria-hidden
                  className={cn('pointer-events-none', 'absolute', 'inset-0', '-translate-x-full', 'bg-gradient-to-r', 'from-transparent', 'via-white/25', 'to-transparent', 'group-hover:animate-[arc-shimmer_1.1s_ease]')}
                />
              </Button>
            </Magnetic>

            <Magnetic strength={0.25} className={cn('w-full', 'sm:w-auto')}>
              <Button size="lg" variant="outline" className={cn('w-full', 'sm:w-auto')}>
                <Link href="/docs">
                  Read the documentation
                </Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}