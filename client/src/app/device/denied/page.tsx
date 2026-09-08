"use client";

import { Terminal, X } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function DeviceDeniedPage() {
  return (
    <main className={cn('flex', 'min-h-screen', 'items-center', 'justify-center', 'bg-gray-50', 'px-6')}>
      <div className={cn('w-full', 'max-w-md', 'text-center')}>

        {/* Logo */}
        <div className={cn('mx-auto', 'mb-6', 'flex', 'h-14', 'w-14', 'items-center', 'justify-center', 'rounded-2xl', 'bg-black', 'text-white')}>
          <Terminal className={cn('h-6', 'w-6')} />
        </div>

        {/* Denied icon */}
        <div className={cn('mx-auto', 'mb-5', 'flex', 'h-16', 'w-16', 'items-center', 'justify-center', 'rounded-full', 'bg-red-100')}>
          <X className={cn('h-8', 'w-8', 'text-red-600')} />
        </div>

        <h1 className={cn('text-2xl', 'font-bold', 'text-gray-950')}>
          Authorization Denied
        </h1>

        <p className={cn('mx-auto', 'mt-3', 'max-w-sm', 'text-sm', 'leading-6', 'text-gray-500')}>
          The Cognivex terminal was not authorized to access
          your account.
        </p>

        <div className={cn('mt-8', 'rounded-xl', 'border', 'bg-white', 'p-4', 'shadow-sm')}>
          <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>
            Device access denied
          </p>

          <p className={cn('mt-1', 'text-xs', 'text-gray-500')}>
            Return to your terminal if you want to start the
            authorization process again.
          </p>
        </div>

        <p className={cn('mt-6', 'text-xs', 'text-gray-400')}>
          You can safely close this window.
        </p>
      </div>
    </main>
  );
}