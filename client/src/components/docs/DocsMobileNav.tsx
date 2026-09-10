"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DocsSidebar } from "./DocsSidebar";

interface DocsMobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocsMobileNav({ open, onOpenChange }: DocsMobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 bg-white">
        <SheetHeader className="border-b border-zinc-200 p-4">
          <SheetTitle className="text-left font-bold text-sm">
            Cognivex Docs Navigation
          </SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-65px)] overflow-y-auto p-4">
          <DocsSidebar onItemClick={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
