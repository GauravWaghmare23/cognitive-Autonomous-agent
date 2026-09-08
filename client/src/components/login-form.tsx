"use client";

import { useState } from "react";
import { authClient } from "@/lib/authClient";
import { cn } from "../lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailPasswordLoading, setIsEmailPasswordLoading] =
    useState(false);

  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const [error, setError] = useState("");

  const isLoading =
    isEmailPasswordLoading || isGithubLoading;

  const handleEmailLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setIsEmailPasswordLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Invalid email or password.");
        return;
      }

      router.replace(redirect || "/dashboard");
      
    } catch (error) {
      console.error("Email login failed:", error);
      setError("Failed to login. Please try again.");
    } finally {
      setIsEmailPasswordLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    setIsGithubLoading(true);

    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "http://localhost:3000/dashboard",
      });
    } catch (error) {
      console.error("GitHub login failed:", error);
      setError("Failed to login with GitHub. Please try again.");
      setIsGithubLoading(false);
    }
  };

  return (
    <div className={cn('w-full', 'max-w-md')}>
      <div className={cn('mb-8', 'text-center')}>
        <h1 className={cn('text-3xl', 'font-semibold', 'tracking-tight')}>
          Welcome back
        </h1>

        <p className={cn('mt-2', 'text-sm', 'text-muted-foreground')}>
          <p className={cn('mt-2', 'text-sm', 'text-muted-foreground')}>Sign in to your Cognivex account</p>
        </p>
      </div>

      <div className={cn('rounded-xl', 'border', 'bg-card', 'p-6', 'shadow-sm')}>
        <form onSubmit={handleEmailLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className={cn('text-sm', 'font-medium')}
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              autoComplete="email"
              required
              className={cn('h-10', 'w-full', 'rounded-md', 'border', 'bg-background', 'px-3', 'text-sm', 'outline-none', 'focus:ring-2', 'focus:ring-ring', 'disabled:cursor-not-allowed', 'disabled:opacity-50')}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className={cn('text-sm', 'font-medium')}
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              required
              className={cn('h-10', 'w-full', 'rounded-md', 'border', 'bg-background', 'px-3', 'text-sm', 'outline-none', 'focus:ring-2', 'focus:ring-ring', 'disabled:cursor-not-allowed', 'disabled:opacity-50')}
            />
          </div>

          {/* Error */}
          {error && (
            <div className={cn('rounded-md', 'border', 'border-red-200', 'bg-red-50', 'px-3', 'py-2')}>
              <p className={cn('text-sm', 'text-red-600')}>
                {error}
              </p>
            </div>
          )}

          {/* Email Login */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn('h-10', 'w-full', 'rounded-md', 'bg-primary', 'px-4', 'text-sm', 'font-medium', 'text-primary-foreground', 'transition-opacity', 'hover:opacity-90', 'disabled:cursor-not-allowed', 'disabled:opacity-50')}
          >
            {isEmailPasswordLoading ? (
              <span className={cn('flex', 'items-center', 'justify-center', 'gap-2')}>
                <span className={cn('h-4', 'w-4', 'animate-spin', 'rounded-full', 'border-2', 'border-current', 'border-t-transparent')} />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className={cn('my-6', 'flex', 'items-center', 'gap-3')}>
          <div className={cn('h-px', 'flex-1', 'bg-border')} />

          <span className={cn('text-xs', 'text-muted-foreground')}>
            OR
          </span>

          <div className={cn('h-px', 'flex-1', 'bg-border')} />
        </div>

        {/* GitHub */}
        <button
          type="button"
          onClick={handleGithubLogin}
          disabled={isLoading}
          className={cn('flex', 'h-10', 'w-full', 'items-center', 'justify-center', 'gap-2', 'rounded-md', 'border', 'bg-background', 'px-4', 'text-sm', 'font-medium', 'transition-colors', 'hover:bg-accent', 'disabled:cursor-not-allowed', 'disabled:opacity-50')}
        >
          {isGithubLoading ? (
            <>
              <span className={cn('h-4', 'w-4', 'animate-spin', 'rounded-full', 'border-2', 'border-current', 'border-t-transparent')} />
              Connecting to GitHub...
            </>
          ) : (
            "Continue with GitHub"
          )}
        </button>
      </div>

      {/* Register */}
      <p className={cn('mt-6', 'text-center', 'text-sm', 'text-muted-foreground')}>
        Don't have an account?{" "}
        <a
          href="/register"
          className={cn('font-medium', 'text-foreground', 'underline', 'underline-offset-4', 'hover:no-underline')}
        >
          Create an account
        </a>
      </p>
    </div>
  );
};