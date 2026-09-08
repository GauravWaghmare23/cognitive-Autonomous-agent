import { cn } from "../../lib/utils";
import { GlobalFX, Reveal, CopyButton } from "./fx";

interface Step {
  number: string;
  title: string;
  description: string;
  command: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Install Cognivex",
    description:
      "Install Cognivex globally and make it available directly from your terminal.",
    command: "npm install -g arc-cli",
  },
  {
    number: "02",
    title: "Connect your account",
    description:
      "Sign in to your Cognivex account and connect your development environment.",
    command: "arc login",
  },
  {
    number: "03",
    title: "Start building",
    description:
      "Ask questions, understand your code, debug problems, and work faster with AI.",
    command: "arc",
  },
];

export function HowItWorksSection() {
  return (
    <section className={cn('border-t', 'px-6', 'py-24', 'md:py-32')}>
      <GlobalFX />
      <div className={cn('mx-auto', 'max-w-6xl')}>
        {/* Section heading */}
        <Reveal className={cn('mx-auto', 'max-w-2xl', 'text-center')}>
          <p className={cn('text-sm', 'font-medium', 'text-primary')}>
            HOW IT WORKS
          </p>

          <h2 className={cn('mt-3', 'text-3xl', 'font-bold', 'tracking-tight', 'sm:text-4xl')}>
            From installation to AI assistance in minutes.
          </h2>

          <p className={cn('mt-4', 'text-base', 'leading-7', 'text-muted-foreground')}>
            Get Cognivex running in your development environment
            and start using AI directly from your terminal.
          </p>
        </Reveal>

        {/* Steps */}
        <div className={cn('relative', 'mt-16', 'grid', 'gap-6', 'md:grid-cols-3')}>
          {/* connecting line, desktop only */}
          <div
            aria-hidden
            className={cn('absolute', 'left-0', 'right-0', 'top-[2.35rem]', 'hidden', 'h-px', 'bg-gradient-to-r', 'from-transparent', 'via-border', 'to-transparent', 'md:block')}
          />

          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 100}>
              <StepCard {...step} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, title, description, command }: Step) {
  return (
    <div className={cn('group relative rounded-xl border bg-background p-6 transition-colors duration-300 hover:border-emerald-500/30')}>
      {/* Step number */}
      <span
        className={cn(
          'relative inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background font-mono text-sm text-muted-foreground',
          'transition-colors duration-300 group-hover:border-emerald-500/40 group-hover:text-emerald-600'
        )}
      >
        {number}
      </span>

      {/* Title */}
      <h3 className={cn('mt-5', 'text-lg', 'font-semibold', 'tracking-tight')}>
        {title}
      </h3>

      {/* Description */}
      <p className={cn('mt-2', 'text-sm', 'leading-6', 'text-muted-foreground')}>
        {description}
      </p>

      {/* Command */}
      <div
        className={cn(
          'mt-6 flex items-center rounded-lg border bg-muted/50 py-3 pl-4 pr-1.5 font-mono text-sm',
          'transition-colors duration-300 group-hover:bg-muted/70'
        )}
      >
        <span className={cn('mr-2', 'text-emerald-600')}>
          $
        </span>

        <span className="flex-1">{command}</span>

        <CopyButton
          value={command}
          className={cn('text-muted-foreground/60', 'hover:bg-foreground/5', 'hover:text-foreground')}
        />
      </div>
    </div>
  );
}