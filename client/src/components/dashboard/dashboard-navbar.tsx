"use client";

import Link from "next/link";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";

export function DashboardNavbar() {
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className={cn(
        "border-b",
        "bg-background/80",
        "backdrop-blur"
      )}
    >
      <div
        className={cn(
          "mx-auto",
          "flex",
          "h-16",
          "max-w-7xl",
          "items-center",
          "justify-between",
          "px-6"
        )}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className={cn(
            "flex",
            "items-center",
            "gap-2",
            "font-semibold"
          )}
        >
          <div
            className={cn(
              "flex",
              "h-8",
              "w-8",
              "items-center",
              "justify-center",
              "rounded-md",
              "bg-primary",
              "text-sm",
              "font-bold",
              "text-primary-foreground"
            )}
          >
            A
          </div>

          <span>Cognivex</span>
        </Link>

        {/* Center Navigation */}
        <nav
          className={cn(
            "hidden",
            "items-center",
            "gap-6",
            "text-sm",
            "md:flex"
          )}
        >
          <Link
            href="/dashboard"
            className={cn(
              "text-muted-foreground",
              "transition-colors",
              "hover:text-foreground"
            )}
          >
            Dashboard
          </Link>

          <Link
            href="/docs"
            className={cn(
              "text-muted-foreground",
              "transition-colors",
              "hover:text-foreground"
            )}
          >
            Docs
          </Link>

          <a
            href="https://github.com/GauravWaghmare23/Arc"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-muted-foreground",
              "transition-colors",
              "hover:text-foreground"
            )}
          >
            GitHub
          </a>
        </nav>

        {/* Right Actions */}
        <div className={cn("flex", "items-center", "gap-3")}>
          {isPending ? (
            <div
              className={cn(
                "h-9",
                "w-20",
                "animate-pulse",
                "rounded-md",
                "bg-muted"
              )}
            />
          ) : session ? (
            <>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className={cn(
                    "h-8",
                    "w-8",
                    "rounded-full",
                    "object-cover"
                  )}
                />
              )}

              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button>
              <Link href="/sign-in">
                Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}