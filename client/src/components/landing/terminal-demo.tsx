import { Terminal } from "lucide-react";
import { cn } from "../../lib/utils";
import { GlobalFX, Reveal, CopyButton } from "./fx";

export function TerminalDemo() {
  return (
    <section className={cn('relative', 'px-6', 'pb-24', 'md:pb-32')}>
      <GlobalFX />
      <div className={cn('mx-auto', 'max-w-5xl')}>
        {/* Section heading */}
        <Reveal className={cn('mx-auto', 'max-w-2xl', 'text-center')}>
          <p className={cn('text-sm', 'font-medium', 'text-primary')}>
            SEE COGNIVEX IN ACTION
          </p>

          <h2 className={cn('mt-3', 'text-3xl', 'font-bold', 'tracking-tight', 'sm:text-4xl')}>
            Your AI assistant, right in the terminal.
          </h2>

          <p className={cn('mt-4', 'text-muted-foreground')}>
            Ask questions, understand your codebase, debug
            problems, and get things done without switching
            between tools.
          </p>
        </Reveal>

        {/* Terminal */}
        <Reveal delay={120}>
          <div
            className={cn(
              'relative mt-12 overflow-hidden rounded-xl border bg-black shadow-2xl',
              'ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-emerald-500/10'
            )}
          >
            {/* ambient top glow */}
            <div
              aria-hidden
              className={cn('pointer-events-none', 'absolute', '-top-24', 'left-1/2', 'h-48', 'w-[70%]', '-translate-x-1/2', 'rounded-full', 'bg-emerald-500/10', 'blur-3xl')}
            />

            {/* Terminal header */}
            <div className={cn('relative flex items-center gap-2 border-b border-white/10 px-4 py-3')}>
              <div className={cn('h-3', 'w-3', 'rounded-full', 'bg-red-500/80')} />
              <div className={cn('h-3', 'w-3', 'rounded-full', 'bg-yellow-500/80')} />
              <div className={cn('h-3', 'w-3', 'rounded-full', 'bg-green-500/80')} />

              <div className={cn('ml-3', 'flex', 'items-center', 'gap-2', 'text-xs', 'text-white/40')}>
                <Terminal className={cn('h-3.5', 'w-3.5')} />
                arc
              </div>

              <CopyButton value="arc explain ./src/auth" className="ml-auto" />
            </div>

            {/* Terminal body */}
            <div className={cn('relative min-h-[360px] p-6 font-mono text-sm leading-7')}>
              {/* Command */}
              <div>
                <span className="text-emerald-400">$</span>{" "}
                <span className="text-white">
                  arc explain ./src/auth
                </span>
              </div>

              {/* Processing */}
              <div className={cn('mt-6', 'flex', 'items-center', 'gap-2', 'text-white/40')}>
                <span className={cn('relative', 'flex', 'h-1.5', 'w-1.5')}>
                  <span className={cn('absolute', 'inline-flex', 'h-full', 'w-full', 'animate-ping', 'rounded-full', 'bg-emerald-400/60')} />
                  <span className={cn('relative', 'inline-flex', 'h-1.5', 'w-1.5', 'rounded-full', 'bg-emerald-400')} />
                </span>
                Analyzing ./src/auth...
              </div>

              {/* Response */}
              <div className="mt-6">
                <p className="text-white">
                  Cognivex found 3 authentication flows:
                </p>

                <div className={cn('mt-3', 'space-y-1', 'text-white/60')}>
                  <p>
                    <span className="text-emerald-400">→</span>{" "}
                    Email/password authentication
                  </p>

                  <p>
                    <span className="text-emerald-400">→</span>{" "}
                    GitHub OAuth
                  </p>

                  <p>
                    <span className="text-emerald-400">→</span>{" "}
                    Session management
                  </p>
                </div>
              </div>

              {/* Explanation */}
              <div className={cn('mt-6', 'border-l', 'border-emerald-500/30', 'pl-4', 'text-white/50')}>
                <p>
                  The authentication module uses Better Auth
                  with PostgreSQL persistence and supports both
                  credential-based and OAuth authentication.
                </p>
              </div>

              {/* Next command */}
              <div className="mt-8">
                <span className="text-emerald-400">$</span>{" "}
                <span className="text-white">
                  arc debug ./server
                </span>
              </div>

              {/* Cursor */}
              <div className="mt-2">
                <span className="text-emerald-400">$</span>{" "}
                <span
                  className={cn('inline-block h-4 w-2 bg-white/70 align-middle')}
                  style={{ animation: "arc-blink 1.1s step-end infinite" }}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom note */}
        <Reveal delay={200}>
          <div className={cn('mt-6', 'flex', 'flex-col', 'items-center', 'justify-between', 'gap-3', 'text-sm', 'text-muted-foreground', 'sm:flex-row')}>
            <p>
              No context switching. No browser required.
            </p>

            <p className="font-mono">
              $ arc --help
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}