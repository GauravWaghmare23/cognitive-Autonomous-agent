"use client";

import { authClient } from "@/lib/authClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";

import {
  Check,
  ShieldCheck,
  Terminal,
  X,
  Loader2,
} from "lucide-react";

export default function DeviceApprovePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, isPending } = authClient.useSession();

  const [userCode, setUserCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("user_code");

    if (code) {
      setUserCode(code.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (isPending) return;

    const code = searchParams.get("user_code");

    if (!code) {
      setError("Invalid device authorization request.");
      return;
    }

    if (!session?.user) {
      const redirectPath =
        `/device/approve?user_code=${encodeURIComponent(code)}`;

      router.replace(
        `/sign-in?redirect=${encodeURIComponent(redirectPath)}`
      );
    }
  }, [session, isPending, searchParams, router]);

  const handleApprove = async () => {
    if (!userCode) {
      setError("Invalid device code.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await authClient.device.approve({
        userCode,
      });

      if (error) {
        setError(
          error.error_description || "Failed to authorize this device."
        );
        return;
      }

      console.log("Device approved:", data);

      router.replace("/device/success");
    } catch (error) {
      console.error("Device approval failed:", error);

      setError(
        "Something went wrong while approving the device."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!userCode) {
      setError("Invalid device code.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await authClient.device.deny({
        userCode,
      });

      if (error) {
        setError(
          error.error_description || "Failed to deny device authorization."
        );
        return;
      }

      console.log("Device denied:", data);

      router.replace("/device/denied");
    } catch (error) {
      console.error("Device denial failed:", error);

      setError(
        "Something went wrong while denying the device."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <main className={cn('flex', 'min-h-screen', 'items-center', 'justify-center')}>
        <p>Checking authentication...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className={cn('flex', 'min-h-screen', 'items-center', 'justify-center')}>
        <div className="text-center">
          <Loader2 className={cn('mx-auto', 'mb-3', 'h-5', 'w-5', 'animate-spin')} />
          <h1 className={cn('text-lg', 'font-semibold')}>
            Redirecting to sign in
          </h1>
          <p className={cn('mt-2', 'text-sm', 'text-gray-500')}>
            You need to sign in before authorizing this device.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={cn('flex', 'min-h-screen', 'items-center', 'justify-center', 'bg-gray-50', 'px-6', 'py-12')}>
      <div className={cn('w-full', 'max-w-md')}>

        {/* Header */}
        <div className={cn('mb-8', 'text-center')}>
          <div className={cn('mx-auto', 'mb-4', 'flex', 'h-12', 'w-12', 'items-center', 'justify-center', 'rounded-xl', 'bg-black', 'text-white')}>
            <Terminal className={cn('h-5', 'w-5')} />
          </div>

          <h1 className={cn('text-2xl', 'font-bold')}>
            Cognivex
          </h1>

          <p className={cn('mt-1', 'text-sm', 'text-gray-500')}>
            Cognitive Autonomous Agent
          </p>
        </div>

        {/* Card */}
        <div className={cn('rounded-2xl', 'border', 'bg-white', 'p-6', 'shadow-sm')}>

          {/* Title */}
          <div className="mb-6">
            <div className={cn('mb-4', 'flex', 'h-10', 'w-10', 'items-center', 'justify-center', 'rounded-lg', 'bg-gray-100')}>
              <ShieldCheck className={cn('h-5', 'w-5')} />
            </div>

            <h2 className={cn('text-xl', 'font-semibold')}>
              Device Authorization
            </h2>

            <p className={cn('mt-2', 'text-sm', 'leading-6', 'text-gray-500')}>
              Authorize Cognivex to connect this terminal to your
              account.
            </p>
          </div>

          {/* User */}
          <div className={cn('mb-6', 'rounded-xl', 'border', 'bg-gray-50', 'p-4')}>
            <div className={cn('flex', 'items-center', 'gap-3')}>

              <div className={cn('flex', 'h-10', 'w-10', 'items-center', 'justify-center', 'rounded-full', 'bg-black', 'text-sm', 'font-semibold', 'text-white')}>
                {session.user.name?.charAt(0).toUpperCase() ||
                  session.user.email?.charAt(0).toUpperCase() ||
                  "U"}
              </div>

              <div className={cn('min-w-0', 'flex-1')}>
                <p className={cn('truncate', 'text-sm', 'font-semibold')}>
                  {session.user.name || "Cognivex User"}
                </p>

                <p className={cn('truncate', 'text-xs', 'text-gray-500')}>
                  {session.user.email}
                </p>
              </div>

              <Check className={cn('h-5', 'w-5', 'text-green-600')} />
            </div>
          </div>

          {/* Device Code */}
          <div className="mb-6">
            <label className={cn('mb-2', 'block', 'text-sm', 'font-medium')}>
              Device code
            </label>

            <div className={cn('rounded-xl', 'border', 'bg-gray-50', 'px-4', 'py-5', 'text-center')}>
              <p className={cn('font-mono', 'text-xl', 'font-semibold', 'tracking-[0.3em]')}>
                {userCode || "--------"}
              </p>
            </div>

            <p className={cn('mt-2', 'text-xs', 'text-gray-500')}>
              This code was generated by your Cognivex terminal.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className={cn('mb-5', 'rounded-lg', 'border', 'border-red-200', 'bg-red-50', 'p-3')}>
              <p className={cn('text-sm', 'text-red-600')}>
                {error}
              </p>
            </div>
          )}

          {/* Approve */}
          <button
            type="button"
            onClick={handleApprove}
            disabled={isLoading || !userCode}
            className={cn('flex', 'h-11', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'bg-black', 'px-4', 'text-sm', 'font-semibold', 'text-white', 'hover:bg-gray-800', 'disabled:cursor-not-allowed', 'disabled:opacity-50')}
          >
            {isLoading ? (
              <>
                <Loader2 className={cn('h-4', 'w-4', 'animate-spin')} />
                Authorizing...
              </>
            ) : (
              <>
                Approve device
                <Check className={cn('h-4', 'w-4')} />
              </>
            )}
          </button>

          {/* Deny */}
          <button
            type="button"
            onClick={handleDeny}
            disabled={isLoading || !userCode}
            className={cn('mt-3', 'flex', 'h-11', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-xl', 'border', 'px-4', 'text-sm', 'font-semibold', 'hover:bg-gray-50', 'disabled:cursor-not-allowed', 'disabled:opacity-50')}
          >
            <X className={cn('h-4', 'w-4')} />
            Deny
          </button>
        </div>

        {/* Security message */}
        <p className={cn('mt-6', 'text-center', 'text-xs', 'text-gray-500')}>
          Only authorize Cognivex if you initiated this request
          from your own terminal.
        </p>
      </div>
    </main>
  );
}