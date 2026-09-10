"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/docs/nav";
import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export function DocsSidebar({ className, onItemClick }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-6 text-sm", className)}>
      {NAV.map((group) => (
        <div key={group.id} className="space-y-2">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 px-3">
            {group.title}
          </h3>
          <ul className="space-y-0.5 border-l border-zinc-200 ml-3 pl-2">
            {group.items.map((item) => {
              const href = `/docs/${item.slug}`;
              const isActive = pathname === href;

              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    onClick={onItemClick}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-xs transition-colors",
                      isActive
                        ? "font-semibold text-emerald-600 bg-emerald-50/80 -ml-[9px] border-l-2 border-emerald-500 pl-[15px]"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
