import {
  Bug,
  Compass,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { GlobalFX, GlowOrbs, Reveal } from "./fx";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Compass,
    title: "Understand your code",
    description:
      "Ask Cognivex to explain files, functions, modules, and unfamiliar parts of your codebase without leaving the terminal.",
  },
  {
    icon: Bug,
    title: "Debug faster",
    description:
      "Investigate errors, understand stack traces, and get practical suggestions while working directly in your development environment.",
  },
  {
    icon: Terminal,
    title: "Explore your codebase",
    description:
      "Navigate and understand large projects faster by asking questions about your files, architecture, and dependencies.",
  },
  {
    icon: Workflow,
    title: "Automate workflows",
    description:
      "Turn repetitive development tasks into reusable commands and let Cognivex handle the routine work.",
  },
  {
    icon: Sparkles,
    title: "AI-powered assistance",
    description:
      "Get contextual AI assistance designed specifically for software development and command-line workflows.",
  },
  {
    icon: Zap,
    title: "Stay in your terminal",
    description:
      "No constant context switching between your editor, browser, documentation, and AI tools. Keep your workflow focused.",
  },
];

export function FeaturesSection() {
  return (
    <section className={cn('relative', 'border-t', 'px-6', 'py-24', 'md:py-32')}>
      <GlobalFX />
      <GlowOrbs variant="section" />

      <div className={cn('mx-auto', 'max-w-6xl')}>
        {/* Section heading */}
        <Reveal className="max-w-2xl">
          <p className={cn('text-sm', 'font-medium', 'text-primary')}>
            BUILT FOR DEVELOPERS
          </p>

          <h2 className={cn('mt-3', 'text-3xl', 'font-bold', 'tracking-tight', 'sm:text-4xl')}>
            AI that works where you already work.
          </h2>

          <p className={cn('mt-4', 'text-base', 'leading-7', 'text-muted-foreground')}>
            Cognivex brings practical AI capabilities directly into
            your command-line workflow.
          </p>
        </Reveal>

        {/* Feature grid */}
        <div className={cn('mt-12', 'grid', 'gap-5', 'md:grid-cols-2', 'lg:grid-cols-3')}>
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 60}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group relative h-full overflow-hidden rounded-xl border p-6',
        'transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/[0.06]'
      )}
    >
      <div
        aria-hidden
        className={cn('pointer-events-none', 'absolute', 'inset-0', 'bg-gradient-to-br', 'from-emerald-500/[0.04]', 'to-transparent', 'opacity-0', 'transition-opacity', 'duration-300', 'group-hover:opacity-100')}
      />

      <div
        className={cn(
          'relative inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50 text-foreground',
          'transition-colors duration-300 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-600'
        )}
      >
        <Icon className={cn('h-5', 'w-5')} strokeWidth={1.75} />
      </div>

      <h3 className={cn('relative', 'mt-5', 'font-semibold', 'tracking-tight')}>
        {title}
      </h3>

      <p className={cn('relative', 'mt-2', 'text-sm', 'leading-6', 'text-muted-foreground')}>
        {description}
      </p>
    </div>
  );
}