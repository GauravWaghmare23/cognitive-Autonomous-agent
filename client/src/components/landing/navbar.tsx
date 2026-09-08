"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import { CustomCursor } from "./custom-cursor";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <CustomCursor />

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-background/70 backdrop-blur-md transition-shadow",
          scrolled ? "shadow-[0_1px_0_0_rgba(0,0,0,0.04)]" : "border-transparent"
        )}
      >
        <div className={cn("mx-auto", "flex", "h-16", "max-w-7xl", "items-center", "justify-between", "px-6")}>
          {/* Logo */}
          <Link href="/" data-cursor="link" className={cn("group", "flex", "items-center", "gap-2.5", "font-semibold")}>
            <div
              className={cn(
                "relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg",
                "bg-gradient-to-br from-foreground to-foreground/70 font-mono text-sm font-bold text-background",
                "transition-transform duration-300 group-hover:-rotate-6"
              )}
            >
              <span className={cn('relative', 'z-10')}>A</span>
              <span className={cn('absolute', 'inset-x-0', 'bottom-0', 'h-[2px]', 'bg-emerald-400')} />
            </div>

            <span className="tracking-tight">Cognivex</span>
          </Link>

          {/* Navigation */}
          <nav className={cn('hidden', 'items-center', 'gap-8', 'text-sm', 'md:flex')}>
            <NavLink href="/docs">Docs</NavLink>

            <a
              href="https://github.com/GauravWaghmare23/Arc"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className={cn(
                'group relative flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground'
              )}
            >
              GitHub
              <span className={cn('absolute', '-bottom-1', 'left-0', 'h-px', 'w-0', 'bg-foreground', 'transition-all', 'duration-300', 'group-hover:w-full')} />
            </a>
          </nav>

          {/* Auth Actions */}
          <div className={cn('flex', 'items-center', 'gap-3')} data-cursor="link">
            {isPending ? (
              <div className={cn('h-9', 'w-20', 'animate-pulse', 'rounded-md', 'bg-muted')} />
            ) : session ? (
              <>
                <Button variant="ghost">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>

                <Button className="group">
                  <Link href="/dashboard" className={cn('flex', 'items-center')}>
                    Open Cognivex
                    <span className={cn('ml-1.5', 'inline-block', 'font-mono', 'text-primary-foreground/60', 'transition-transform', 'group-hover:translate-x-0.5')}>
                      ›
                    </span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className={cn('hidden', 'sm:inline-flex')}>
                  <Link href="/sign-in">Sign in</Link>
                </Button>

                <Button>
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn('group', 'relative', 'text-muted-foreground', 'transition-colors', 'hover:text-foreground')}
    >
      {children}
      <span className={cn('absolute', '-bottom-1', 'left-0', 'h-px', 'w-0', 'bg-foreground', 'transition-all', 'duration-300', 'group-hover:w-full')} />
    </Link>
  );
}