import React from "react";
import { DocBlock } from "@/lib/docs/types";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle2, AlertCircle, ArrowDown } from "lucide-react";

interface DocRendererProps {
  blocks: DocBlock[];
}

function parseInlineFormatting(text: string): React.ReactNode {
  // Parses inline code `...`
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.875em] text-zinc-900 border border-zinc-200/80 font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function DocRenderer({ blocks }: DocRendererProps) {
  return (
    <div className="space-y-6 text-zinc-700 leading-relaxed">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            if (block.level === 2) {
              return (
                <h2
                  key={index}
                  id={block.id}
                  className="group scroll-mt-24 pt-6 pb-2 text-2xl font-bold tracking-tight text-zinc-900 border-b border-zinc-100"
                >
                  <a href={`#${block.id}`} className="hover:underline flex items-center gap-2">
                    <span>{block.text}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-zinc-400 text-lg font-normal transition-opacity">
                      #
                    </span>
                  </a>
                </h2>
              );
            }
            return (
              <h3
                key={index}
                id={block.id}
                className="group scroll-mt-24 pt-4 text-xl font-semibold tracking-tight text-zinc-900"
              >
                <a href={`#${block.id}`} className="hover:underline flex items-center gap-2">
                  <span>{block.text}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-zinc-400 text-base font-normal transition-opacity">
                    #
                  </span>
                </a>
              </h3>
            );
          }

          case "paragraph":
            return (
              <p key={index} className="text-zinc-600 text-base leading-7">
                {parseInlineFormatting(block.text)}
              </p>
            );

          case "callout": {
            const toneConfig = {
              info: {
                border: "border-sky-500",
                bg: "bg-sky-50/70",
                text: "text-sky-950",
                icon: <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />,
                titleColor: "text-sky-900",
              },
              warning: {
                border: "border-amber-500",
                bg: "bg-amber-50/70",
                text: "text-amber-950",
                icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />,
                titleColor: "text-amber-900",
              },
              success: {
                border: "border-emerald-500",
                bg: "bg-emerald-50/70",
                text: "text-emerald-950",
                icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />,
                titleColor: "text-emerald-900",
              },
              danger: {
                border: "border-rose-500",
                bg: "bg-rose-50/70",
                text: "text-rose-950",
                icon: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />,
                titleColor: "text-rose-900",
              },
            }[block.tone || "info"];

            return (
              <div
                key={index}
                className={cn(
                  "my-6 flex gap-3.5 rounded-xl border-l-4 p-4 shadow-xs",
                  toneConfig.border,
                  toneConfig.bg
                )}
              >
                {toneConfig.icon}
                <div className="space-y-1">
                  {block.title && (
                    <div className={cn("font-semibold text-sm", toneConfig.titleColor)}>
                      {block.title}
                    </div>
                  )}
                  <div className={cn("text-sm leading-6", toneConfig.text)}>
                    {parseInlineFormatting(block.text)}
                  </div>
                </div>
              </div>
            );
          }

          case "code":
            return (
              <CodeBlock
                key={index}
                code={block.code}
                lang={block.lang}
                label={block.label}
              />
            );

          case "flow":
            return (
              <div key={index} className="my-8 rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-6">
                <div className="flex flex-col items-center space-y-3">
                  {block.steps.map((step, stepIndex) => (
                    <React.Fragment key={stepIndex}>
                      <div className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-xs transition-all hover:border-emerald-500/50 hover:shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 font-mono">
                            {stepIndex + 1}
                          </span>
                          <span className="text-sm font-medium text-zinc-800">
                            {parseInlineFormatting(step)}
                          </span>
                        </div>
                      </div>

                      {stepIndex < block.steps.length - 1 && (
                        <div className="flex items-center justify-center text-zinc-400">
                          <ArrowDown className="h-4 w-4 animate-bounce" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {block.caption && (
                  <p className="mt-4 text-center text-xs text-zinc-500 italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={cn(
                  "my-4 space-y-2 pl-6 text-zinc-600 text-base leading-7",
                  block.ordered ? "list-decimal" : "list-disc marker:text-emerald-500"
                )}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {parseInlineFormatting(item)}
                  </li>
                ))}
              </ListTag>
            );
          }

          case "table":
            return (
              <div key={index} className="my-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-xs">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    <tr>
                      {block.headers.map((header, hIndex) => (
                        <th key={hIndex} className="px-4 py-3">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {block.rows.map((row, rIndex) => (
                      <tr key={rIndex} className="hover:bg-zinc-50/50 transition-colors">
                        {row.map((cell, cIndex) => (
                          <td key={cIndex} className="px-4 py-3 text-zinc-600">
                            {parseInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "keyvalue":
            return (
              <div key={index} className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {block.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="rounded-lg border border-zinc-200/80 bg-zinc-50/40 p-3.5 transition-colors hover:border-zinc-300"
                  >
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {item.label}
                    </div>
                    <div className="mt-1 text-sm font-medium text-zinc-900">
                      {parseInlineFormatting(item.value)}
                    </div>
                  </div>
                ))}
              </div>
            );

          case "divider":
            return <hr key={index} className="my-8 border-zinc-200" />;

          default:
            return null;
        }
      })}
    </div>
  );
}
