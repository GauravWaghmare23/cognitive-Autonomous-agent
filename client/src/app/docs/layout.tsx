import React from "react";
import { DocsTopbar } from "@/components/docs/DocsTopbar";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export const metadata = {
  title: "Documentation — Cognivex",
  description: "Official documentation and developer reference for Cognivex CLI agent.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <DocsTopbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Desktop Left Sidebar */}
          <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-60 shrink-0 overflow-y-auto pr-4 lg:block">
            <DocsSidebar />
          </aside>

          {/* Main Content Area */}
          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
