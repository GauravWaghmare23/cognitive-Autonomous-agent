"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  lang?: string;
  label?: string;
  className?: string;
}

function highlightCode(code: string, lang: string): React.ReactNode {
  if (lang === "json") {
    // Simple regex-based syntax colorizer for JSON
    const lines = code.split("\n");
    return lines.map((line, lineIndex) => {
      // Tokenize keys, strings, numbers, booleans/null
      const parts = line.split(/(".*?"|:\s*true|:\s*false|:\s*null|:\s*-?\d+\.?\d*)/g);
      return (
        <div key={lineIndex} className="table-row">
          <span className="table-cell select-none pr-4 text-right text-xs text-zinc-600 font-mono">
            {lineIndex + 1}
          </span>
          <span className="table-cell">
            {parts.map((part, partIndex) => {
              if (part.startsWith('"') && part.endsWith('"')) {
                // Check if it's a key (followed by colon in original line)
                const isKey = line.indexOf(part + ":") !== -1 || line.indexOf(part + " :") !== -1;
                return (
                  <span
                    key={partIndex}
                    className={isKey ? "text-emerald-400 font-medium" : "text-amber-300"}
                  >
                    {part}
                  </span>
                );
              }
              if (part.includes("true") || part.includes("false") || part.includes("null")) {
                return (
                  <span key={partIndex} className="text-sky-400">
                    {part}
                  </span>
                );
              }
              if (part.match(/:\s*-?\d+/)) {
                return (
                  <span key={partIndex} className="text-purple-400">
                    {part}
                  </span>
                );
              }
              return <span key={partIndex} className="text-zinc-300">{part}</span>;
            })}
          </span>
        </div>
      );
    });
  }

  // General code lines
  const lines = code.split("\n");
  return lines.map((line, index) => {
    let coloredLine: React.ReactNode = line;

    if (lang === "bash" || lang === "sh" || lang === "shell") {
      if (line.trim().startsWith("#")) {
        coloredLine = <span className="text-zinc-500 italic">{line}</span>;
      } else if (line.trim().startsWith("$")) {
        coloredLine = (
          <span>
            <span className="text-emerald-400 font-semibold mr-2">$</span>
            <span className="text-zinc-100">{line.replace(/^\s*\$\s*/, "")}</span>
          </span>
        );
      } else {
        coloredLine = <span className="text-zinc-200">{line}</span>;
      }
    } else {
      coloredLine = <span className="text-zinc-200">{line}</span>;
    }

    return (
      <div key={index} className="table-row">
        <span className="table-cell select-none pr-4 text-right text-xs text-zinc-600 font-mono">
          {index + 1}
        </span>
        <span className="table-cell whitespace-pre">{coloredLine}</span>
      </div>
    );
  });
}

export function CodeBlock({ code, lang = "bash", label, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  return (
    <div
      className={cn(
        "my-5 overflow-hidden rounded-xl border border-zinc-800 bg-[#0d1117] text-zinc-200 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700 inline-block" />
          <span className="font-semibold uppercase text-zinc-400 tracking-wider text-[11px]">
            {label || lang || "code"}
          </span>
        </div>

        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 focus:outline-none"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto p-4 font-mono text-sm leading-6">
        <div className="table min-w-full">
          {highlightCode(code, lang)}
        </div>
      </div>
    </div>
  );
}
