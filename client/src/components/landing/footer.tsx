import Link from "next/link";
import { cn } from "../../lib/utils";

export function Footer() {
  return (
    <footer className={cn('relative', 'border-t')}>
      <div
        aria-hidden
        className={cn('pointer-events-none', 'absolute', 'inset-x-0', 'top-0', 'h-px', 'bg-linear-to-r', 'from-transparent', 'via-emerald-500/40', 'to-transparent')}
      />

      <div className={cn('mx-auto', 'max-w-7xl', 'px-6', 'py-12')}>
        <div className={cn('grid', 'gap-10', 'md:grid-cols-4')}>
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className={cn('inline-flex', 'items-center', 'gap-2.5', 'text-xl', 'font-bold', 'tracking-tight')}
            >
              <div className={cn('flex', 'h-7', 'w-7', 'items-center', 'justify-center', 'rounded-md', 'bg-linear-to-br', 'from-foreground', 'to-foreground/70', 'font-mono', 'text-xs', 'text-background')}>
                A
              </div>
              <span>Cognivex</span>
            </Link>

            <p className={cn('mt-3', 'max-w-sm', 'text-sm', 'leading-6', 'text-muted-foreground')}>
              An AI-powered command-line assistant built to
              help developers understand code, solve problems,
              and build faster.
            </p>

            <a
              href="https://github.com/GauravWaghmare23/Arc"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'mt-5 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs text-muted-foreground',
                'transition-colors hover:border-emerald-500/30 hover:text-foreground'
              )}
            >
              Star on GitHub
            </a>
          </div>

          {/* Product */}
          <div>
            <h3 className={cn('text-sm', 'font-semibold')}>
              Product
            </h3>

            <ul className={cn('mt-4', 'space-y-3', 'text-sm', 'text-muted-foreground')}>
              <li>
                <FooterLink href="/docs">Documentation</FooterLink>
              </li>

              <li>
                <FooterLink href="/dashboard">Dashboard</FooterLink>
              </li>

              <li>
                <FooterLink href="/register">Get started</FooterLink>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={cn('text-sm', 'font-semibold')}>
              Resources
            </h3>

            <ul className={cn('mt-4', 'space-y-3', 'text-sm', 'text-muted-foreground')}>
              <li>
                <a
                  href="https://github.com/GauravWaghmare23/Arc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('transition-colors', 'hover:text-foreground')}
                >
                  GitHub
                </a>
              </li>

              <li>
                <FooterLink href="/docs">Docs</FooterLink>
              </li>

              <li>
                <a
                  href="https://github.com/GauravWaghmare23/Arc/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('transition-colors', 'hover:text-foreground')}
                >
                  Report an issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={cn('mt-10', 'flex', 'flex-col', 'gap-4', 'border-t', 'pt-8', 'sm:flex-row', 'sm:items-center', 'sm:justify-between')}>
          <p className={cn('text-sm', 'text-muted-foreground')}>
            © 2026 Cognivex. All rights reserved.
          </p>

          <div className={cn('flex', 'gap-6', 'text-sm', 'text-muted-foreground')}>
            <FooterLink href="/docs">Documentation</FooterLink>

            <a
              href="https://github.com/GauravWaghmare23/Arc"
              target="_blank"
              rel="noopener noreferrer"
              className={cn('transition-colors', 'hover:text-foreground')}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn('transition-colors', 'hover:text-foreground')}>
      {children}
    </Link>
  );
}