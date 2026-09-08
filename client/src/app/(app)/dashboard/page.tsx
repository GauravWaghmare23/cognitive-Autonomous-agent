"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  // Loading state
  if (isPending) {
    return (
      <main
        className={cn(
          "flex",
          "min-h-screen",
          "items-center",
          "justify-center",
          "p-6"
        )}
      >
        <div className={cn("flex", "items-center", "gap-3")}>
          <div
            className={cn(
              "h-5",
              "w-5",
              "animate-spin",
              "rounded-full",
              "border-2",
              "border-primary",
              "border-t-transparent"
            )}
          />

          <p
            className={cn(
              "text-sm",
              "text-muted-foreground"
            )}
          >
            Loading your workspace...
          </p>
        </div>
      </main>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <main
        className={cn(
          "flex",
          "min-h-screen",
          "items-center",
          "justify-center",
          "p-6"
        )}
      >
        <Card className={cn("w-full", "max-w-md")}>
          <CardHeader>
            <CardTitle>
              Authentication required
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p
              className={cn(
                "text-sm",
                "text-muted-foreground"
              )}
            >
              You need to sign in before accessing your
              Cognivex workspace.
            </p>

            <Button
              className={cn("mt-6", "w-full")}
              onClick={() => {
                router.replace("/sign-in");
              }}
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Authenticated dashboard
  return (
    <main
      className={cn(
        "min-h-screen",
        "bg-muted/30"
      )}
    >
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Dashboard Content */}
      <div
        className={cn(
          "mx-auto",
          "max-w-6xl",
          "px-6",
          "py-10"
        )}
      >
        {/* Welcome */}
        <div className="mb-10">
          <p
            className={cn(
              "text-sm",
              "text-muted-foreground"
            )}
          >
            Dashboard
          </p>

          <h1
            className={cn(
              "mt-2",
              "text-3xl",
              "font-bold",
              "tracking-tight"
            )}
          >
            Welcome back,{" "}
            {session.user.name || "User"}
          </h1>

          <p
            className={cn(
              "mt-2",
              "text-muted-foreground"
            )}
          >
            Your Cognivex workspace is ready.
          </p>
        </div>

        {/* Overview Cards */}
        <div
          className={cn(
            "grid",
            "gap-6",
            "md:grid-cols-3"
          )}
        >
          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Account
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div
                className={cn(
                  "flex",
                  "items-center",
                  "gap-4"
                )}
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={
                      session.user.name || "User"
                    }
                    className={cn(
                      "h-14",
                      "w-14",
                      "rounded-full",
                      "object-cover"
                    )}
                  />
                ) : (
                  <div
                    className={cn(
                      "flex",
                      "h-14",
                      "w-14",
                      "items-center",
                      "justify-center",
                      "rounded-full",
                      "bg-primary",
                      "text-lg",
                      "font-semibold",
                      "text-primary-foreground"
                    )}
                  >
                    {session.user.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>
                )}

                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate",
                      "font-medium"
                    )}
                  >
                    {session.user.name ||
                      "User"}
                  </p>

                  <p
                    className={cn(
                      "truncate",
                      "text-sm",
                      "text-muted-foreground"
                    )}
                  >
                    {session.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Authentication
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div
                className={cn(
                  "flex",
                  "items-center",
                  "justify-between"
                )}
              >
                <span
                  className={cn(
                    "text-sm",
                    "text-muted-foreground"
                  )}
                >
                  Status
                </span>

                <span
                  className={cn(
                    "rounded-full",
                    "bg-green-100",
                    "px-3",
                    "py-1",
                    "text-xs",
                    "font-medium",
                    "text-green-700"
                  )}
                >
                  Authenticated
                </span>
              </div>

              <Separator className="my-4" />

              <div
                className={cn(
                  "flex",
                  "items-center",
                  "justify-between"
                )}
              >
                <span
                  className={cn(
                    "text-sm",
                    "text-muted-foreground"
                  )}
                >
                  Email
                </span>

                <span
                  className={cn(
                    "text-sm",
                    "font-medium"
                  )}
                >
                  {session.user.emailVerified
                    ? "Verified"
                    : "Unverified"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cognivex Workspace */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Cognivex Workspace
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p
                className={cn(
                  "text-sm",
                  "text-muted-foreground"
                )}
              >
                Your AI command-line workspace is
                ready to use.
              </p>

              <Button
                className={cn("mt-4", "w-full")}
                onClick={() => {
                  router.push("/workspace");
                }}
              >
                Open Cognivex
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              Profile information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div
              className={cn(
                "grid",
                "gap-6",
                "md:grid-cols-2"
              )}
            >
              <div>
                <p
                  className={cn(
                    "text-sm",
                    "text-muted-foreground"
                  )}
                >
                  Name
                </p>

                <p
                  className={cn(
                    "mt-1",
                    "font-medium"
                  )}
                >
                  {session.user.name ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p
                  className={cn(
                    "text-sm",
                    "text-muted-foreground"
                  )}
                >
                  Email
                </p>

                <p
                  className={cn(
                    "mt-1",
                    "font-medium"
                  )}
                >
                  {session.user.email}
                </p>
              </div>

              <div>
                <p
                  className={cn(
                    "text-sm",
                    "text-muted-foreground"
                  )}
                >
                  User ID
                </p>

                <p
                  className={cn(
                    "mt-1",
                    "break-all",
                    "font-mono",
                    "text-sm"
                  )}
                >
                  {session.user.id}
                </p>
              </div>

              <div>
                <p
                  className={cn(
                    "text-sm",
                    "text-muted-foreground"
                  )}
                >
                  Account status
                </p>

                <p
                  className={cn(
                    "mt-1",
                    "font-medium"
                  )}
                >
                  Active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div
          className={cn(
            "mt-6",
            "grid",
            "gap-6",
            "md:grid-cols-2"
          )}
        >
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle>
                Quick start
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p
                className={cn(
                  "text-sm",
                  "text-muted-foreground"
                )}
              >
                Start using Cognivex from your terminal
                and connect your development
                workflow with your AI assistant.
              </p>

              <Button
                className="mt-4"
                onClick={() => {
                  router.push("/workspace");
                }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>
                Documentation
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p
                className={cn(
                  "text-sm",
                  "text-muted-foreground"
                )}
              >
                Learn how to install, configure,
                and use Cognivex in your development
                workflow.
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  router.push("/docs");
                }}
              >
                View Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}