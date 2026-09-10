"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: { level: 2 | 3; text: string; id: string }[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -60% 0%", threshold: 0.1 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-20 hidden w-64 shrink-0 xl:block">
      <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/30 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          On this page
        </h4>

        <nav className="space-y-1 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={cn(
                  "block py-1 text-xs transition-colors rounded-md px-2",
                  heading.level === 3 ? "ml-3 text-zinc-500" : "font-medium text-zinc-600",
                  isActive
                    ? "bg-emerald-50 text-emerald-600 font-semibold border-l-2 border-emerald-500"
                    : "hover:text-zinc-900 hover:bg-zinc-100/60"
                )}
              >
                {heading.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
