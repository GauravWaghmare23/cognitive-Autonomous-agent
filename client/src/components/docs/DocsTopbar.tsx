"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "./SearchDialog";
import { DocsMobileNav } from "./DocsMobileNav";

export function DocsTopbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile trigger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Open documentation navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-zinc-900 font-mono text-xs font-bold text-white">
                <span>A</span>
                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-emerald-400" />
              </div>
              <span className="tracking-tight text-sm sm:text-base font-bold text-zinc-900">
                Cognivex
              </span>
            </Link>

            <span className="text-zinc-300">/</span>
            <Link
              href="/docs"
              className="text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Docs
            </Link>
          </div>

          {/* Right: Search & External Links */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100/80 hover:text-zinc-900 sm:w-64 sm:justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Search docs...</span>
                <span className="sm:hidden">Search...</span>
              </span>
              <kbd className="hidden sm:inline-flex items-center rounded border border-zinc-200 bg-white px-1.5 font-mono text-[10px] font-medium text-zinc-500 shadow-xs">
                ⌘K
              </kbd>
            </button>

            <a
              href="https://github.com/GauravWaghmare23/Arc"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-500 transition-colors hover:text-zinc-900 rounded-md hover:bg-zinc-100"
              aria-label="GitHub Repository"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-2xs"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <DocsMobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
    </>
  );
}
