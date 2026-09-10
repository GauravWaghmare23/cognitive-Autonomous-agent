import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavItem } from "@/lib/docs/types";

interface PrevNextNavProps {
  prev: (NavItem & { groupTitle: string }) | null;
  next: (NavItem & { groupTitle: string }) | null;
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-between">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-1 flex-col rounded-xl border border-zinc-200 p-4 transition-all hover:border-emerald-500/50 hover:bg-zinc-50/50"
        >
          <span className="flex items-center gap-1 text-xs font-medium text-zinc-500">
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Previous ({prev.groupTitle})
          </span>
          <span className="mt-1 text-sm font-semibold text-zinc-900 group-hover:text-emerald-600">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-1 flex-col items-end rounded-xl border border-zinc-200 p-4 text-right transition-all hover:border-emerald-500/50 hover:bg-zinc-50/50"
        >
          <span className="flex items-center gap-1 text-xs font-medium text-zinc-500">
            Next ({next.groupTitle})
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-1 text-sm font-semibold text-zinc-900 group-hover:text-emerald-600">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
