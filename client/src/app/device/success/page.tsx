"use client";

import { Check, Terminal } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function DeviceSuccessPage() {
  return (
    <main className={cn('flex', 'min-h-screen', 'items-center', 'justify-center', 'bg-gray-50', 'px-6')}>
      <div className={cn('w-full', 'max-w-md', 'text-center')}>

        {/* Logo */}
        <div className={cn('mx-auto', 'mb-6', 'flex', 'h-14', 'w-14', 'items-center', 'justify-center', 'rounded-2xl', 'bg-black', 'text-white')}>
          <Terminal className={cn('h-6', 'w-6')} />
        </div>

        {/* Success icon */}
        <div className={cn('mx-auto', 'mb-5', 'flex', 'h-16', 'w-16', 'items-center', 'justify-center', 'rounded-full', 'bg-green-100')}>
          <Check className={cn('h-8', 'w-8', 'text-green-600')} />
        </div>

        <h1 className={cn('text-2xl', 'font-bold', 'text-gray-950')}>
          Device Authorized
        </h1>

        <p className={cn('mx-auto', 'mt-3', 'max-w-sm', 'text-sm', 'leading-6', 'text-gray-500')}>
          Your Cognivex terminal has been successfully connected
          to your account.
        </p>

        <div className={cn('mt-8', 'rounded-xl', 'border', 'bg-white', 'p-4', 'shadow-sm')}>
          <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>
            Authentication complete
          </p>

          <p className={cn('mt-1', 'text-xs', 'text-gray-500')}>
            You can return to your terminal and continue using Cognivex.
          </p>
        </div>

        <p className={cn('mt-6', 'text-xs', 'text-gray-400')}>
          You can safely close this window.
        </p>
      </div>
    </main>
  );
}