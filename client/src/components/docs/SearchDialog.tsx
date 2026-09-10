"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { searchIndex, SearchIndexEntry } from "@/lib/docs/search-index";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  // Grab surrounding snippet if it's long
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + query.length + 60);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";

  const snippet = text.slice(start, end);
  const matchIndex = snippet.toLowerCase().indexOf(query.toLowerCase());

  if (matchIndex === -1) return `${prefix}${snippet}${suffix}`;

  const before = snippet.slice(0, matchIndex);
  const match = snippet.slice(matchIndex, matchIndex + query.length);
  const after = snippet.slice(matchIndex + query.length);

  return (
    <span>
      {prefix}
      {before}
      <span className="bg-emerald-100 text-emerald-800 font-semibold px-0.5 rounded">
        {match}
      </span>
      {after}
      {suffix}
    </span>
  );
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Filter results
  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return searchIndex
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(trimmed) ||
          item.groupTitle.toLowerCase().includes(trimmed) ||
          item.text.toLowerCase().includes(trimmed)
        );
      })
      .slice(0, 8);
  }, [query]);

  // Keyboard shortcut Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(`/docs/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 gap-0 border-zinc-200 bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Documentation</DialogTitle>
          <DialogDescription>Search Cognivex documentation pages</DialogDescription>
        </DialogHeader>

        {/* Input bar */}
        <div className="flex items-center border-b border-zinc-200 px-4 py-3 bg-zinc-50/50">
          <Search className="h-5 w-5 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs, agents, tools, commands..."
            className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-zinc-200 bg-white px-1.5 font-mono text-[10px] font-medium text-zinc-500">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-zinc-400 text-sm">
              <FileText className="mx-auto h-8 w-8 mb-2 text-zinc-300" />
              <p>Type to search across all documentation, guides, and tools</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              <p>No results found for &ldquo;<span className="font-semibold text-zinc-700">{query}</span>&rdquo;</p>
              <p className="mt-1 text-xs text-zinc-400">Try searching for &quot;explorer&quot;, &quot;login&quot;, &quot;search_files&quot;, or &quot;architecture&quot;.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleSelect(item.slug)}
                  className="w-full flex flex-col items-start rounded-lg p-3 text-left transition-colors hover:bg-zinc-100/80 focus:bg-zinc-100 focus:outline-none group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                      {item.groupTitle}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="font-semibold text-sm text-zinc-900 mt-0.5">
                    {highlightMatch(item.title, query)}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-normal">
                    {highlightMatch(item.text, query)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
