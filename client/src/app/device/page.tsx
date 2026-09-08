"use client";

import { authClient } from "@/lib/authClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import {
    ArrowRight,
    Check,
    Loader2,
    ShieldCheck,
    Terminal,
} from "lucide-react";

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: session, isPending } = authClient.useSession();

    const [userCode, setUserCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

        if (!session) {
            const redirectPath = `/device?user_code=${encodeURIComponent(
                code
            )}`;

            router.replace(
                `/sign-in?redirect=${encodeURIComponent(redirectPath)}`
            );
        }
    }, [session, isPending, searchParams, router]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError(null);

        const formattedCode = userCode
            .trim()
            .replace(/-/g, "")
            .toUpperCase();

        if (!formattedCode) {
            setError("Please enter a device code.");
            return;
        }

        setIsLoading(true);

        try {
            if (!session?.user) {
                const verificationPath = `/device?user_code=${encodeURIComponent(
                    formattedCode
                )}`;

                router.replace(
                    `/sign-in?redirect=${encodeURIComponent(
                        verificationPath
                    )}`
                );

                return;
            }

            // Verify and claim the device code
            const { data, error } = await authClient.device({
                query: {
                    user_code: formattedCode,
                },
            });

            if (error || !data) {
                setError("Invalid or expired device code.");
                return;
            }

            // Code is valid and has been claimed by
            // the current authenticated session.
            router.push(
                `/device/approve?user_code=${encodeURIComponent(
                    formattedCode
                )}`
            );
        } catch (error) {
            console.error("Device verification failed:", error);

            setError(
                "Unable to verify the device code. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isPending) {
        return (
            <main
                className={cn(
                    "flex",
                    "min-h-screen",
                    "items-center",
                    "justify-center",
                    "bg-background",
                    "px-6"
                )}
            >
                <div
                    className={cn(
                        "flex",
                        "items-center",
                        "gap-3",
                        "text-sm",
                        "text-muted-foreground"
                    )}
                >
                    <Loader2
                        className={cn(
                            "h-4",
                            "w-4",
                            "animate-spin"
                        )}
                    />

                    <span>Checking authentication...</span>
                </div>
            </main>
        );
    }

    if (!session) {
        const code = searchParams.get("user_code");

        const redirectPath = code
            ? `/device?user_code=${encodeURIComponent(code)}`
            : "/device";

        return (
            <main
                className={cn(
                    "relative",
                    "flex",
                    "min-h-screen",
                    "items-center",
                    "justify-center",
                    "overflow-hidden",
                    "bg-background",
                    "px-6",
                    "py-12"
                )}
            >
                <div
                    className={cn(
                        "w-full",
                        "max-w-md",
                        "rounded-2xl",
                        "border",
                        "bg-card",
                        "p-8",
                        "text-center",
                        "shadow-sm"
                    )}
                >
                    <div
                        className={cn(
                            "mx-auto",
                            "mb-5",
                            "flex",
                            "h-12",
                            "w-12",
                            "items-center",
                            "justify-center",
                            "rounded-full",
                            "bg-muted"
                        )}
                    >
                        <ShieldCheck className={cn('h-6', 'w-6')} />
                    </div>

                    <h1
                        className={cn(
                            "text-xl",
                            "font-semibold",
                            "tracking-tight"
                        )}
                    >
                        Sign in to continue
                    </h1>

                    <p
                        className={cn(
                            "mt-2",
                            "text-sm",
                            "leading-6",
                            "text-muted-foreground"
                        )}
                    >
                        Cognivex needs you to sign in before you can
                        authorize this device.
                    </p>

                    <p
                        className={cn(
                            "mt-3",
                            "text-xs",
                            "text-muted-foreground"
                        )}
                    >
                        Your device authorization code will be
                        preserved while you sign in.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            router.push(
                                `/sign-in?redirect=${encodeURIComponent(
                                    redirectPath
                                )}`
                            );
                        }}
                        className={cn(
                            "mt-6",
                            "flex",
                            "h-11",
                            "w-full",
                            "items-center",
                            "justify-center",
                            "gap-2",
                            "rounded-lg",
                            "bg-primary",
                            "text-sm",
                            "font-medium",
                            "text-primary-foreground",
                            "transition",
                            "hover:bg-primary/90"
                        )}
                    >
                        Sign in to Cognivex
                        <ArrowRight className={cn('h-4', 'w-4')} />
                    </button>

                    <p
                        className={cn(
                            "mt-5",
                            "text-xs",
                            "text-muted-foreground"
                        )}
                    >
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => {
                                router.push(
                                    `/register?redirect=${encodeURIComponent(
                                        redirectPath
                                    )}`
                                );
                            }}
                            className={cn(
                                "font-medium",
                                "text-foreground",
                                "underline",
                                "underline-offset-4"
                            )}
                        >
                            Create one
                        </button>
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main
            className={cn(
                "relative",
                "flex",
                "min-h-screen",
                "items-center",
                "justify-center",
                "overflow-hidden",
                "bg-background",
                "px-6",
                "py-12"
            )}
        >
            {/* Background decoration */}
            <div
                className={cn(
                    "pointer-events-none",
                    "absolute",
                    "inset-0",
                    "bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.08),transparent_45%)]"
                )}
            />

            <div
                className={cn(
                    "relative",
                    "w-full",
                    "max-w-md"
                )}
            >
                {/* Logo / Brand */}
                <div
                    className={cn(
                        "mb-8",
                        "flex",
                        "flex-col",
                        "items-center",
                        "text-center"
                    )}
                >
                    <div
                        className={cn(
                            "mb-4",
                            "flex",
                            "h-12",
                            "w-12",
                            "items-center",
                            "justify-center",
                            "rounded-xl",
                            "bg-primary",
                            "text-primary-foreground",
                            "shadow-sm"
                        )}
                    >
                        <Terminal className={cn('h-6', 'w-6')} />
                    </div>

                    <h1
                        className={cn(
                            "text-2xl",
                            "font-bold",
                            "tracking-tight"
                        )}
                    >
                        Cognivex
                    </h1>

                    <p
                        className={cn(
                            "mt-1",
                            "text-sm",
                            "text-muted-foreground"
                        )}
                    >
                        Cognitive Autonomous Agent
                    </p>
                </div>

                {/* Authorization Card */}
                <div
                    className={cn(
                        "rounded-2xl",
                        "border",
                        "bg-card",
                        "p-6",
                        "shadow-sm"
                    )}
                >
                    {/* Header */}
                    <div className="mb-6">
                        <div
                            className={cn(
                                "mb-4",
                                "flex",
                                "h-10",
                                "w-10",
                                "items-center",
                                "justify-center",
                                "rounded-lg",
                                "bg-muted"
                            )}
                        >
                            <ShieldCheck className={cn('h-5', 'w-5')} />
                        </div>

                        <h2
                            className={cn(
                                "text-xl",
                                "font-semibold",
                                "tracking-tight"
                            )}
                        >
                            Device Authorization
                        </h2>

                        <p
                            className={cn(
                                "mt-2",
                                "text-sm",
                                "leading-6",
                                "text-muted-foreground"
                            )}
                        >
                            Authorize Cognivex to connect this terminal
                            to your account.
                        </p>
                    </div>

                    {/* Signed-in user */}
                    <div
                        className={cn(
                            "mb-6",
                            "flex",
                            "items-center",
                            "gap-3",
                            "rounded-lg",
                            "border",
                            "bg-muted/40",
                            "p-3"
                        )}
                    >
                        <div
                            className={cn(
                                "flex",
                                "h-9",
                                "w-9",
                                "shrink-0",
                                "items-center",
                                "justify-center",
                                "rounded-full",
                                "bg-primary",
                                "text-sm",
                                "font-semibold",
                                "text-primary-foreground"
                            )}
                        >
                            {session.user.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                session.user.email
                                    ?.charAt(0)
                                    .toUpperCase() ||
                                "U"}
                        </div>

                        <div className="min-w-0">
                            <p
                                className={cn(
                                    "truncate",
                                    "text-sm",
                                    "font-medium"
                                )}
                            >
                                {session.user.name || "Authenticated user"}
                            </p>

                            <p
                                className={cn(
                                    "truncate",
                                    "text-xs",
                                    "text-muted-foreground"
                                )}
                            >
                                {session.user.email}
                            </p>
                        </div>

                        <Check
                            className={cn(
                                "ml-auto",
                                "h-4",
                                "w-4",
                                "shrink-0",
                                "text-green-600"
                            )}
                        />
                    </div>

                    {/* Device Code */}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="code"
                                className={cn(
                                    "mb-2",
                                    "block",
                                    "text-sm",
                                    "font-medium"
                                )}
                            >
                                Device code
                            </label>

                            <input
                                id="code"
                                type="text"
                                value={userCode}
                                onChange={(e) => {
                                    setUserCode(
                                        e.target.value.toUpperCase()
                                    );

                                    setError(null);
                                }}
                                placeholder="XXXXXXXX"
                                maxLength={9}
                                autoComplete="off"
                                spellCheck={false}
                                className={cn(
                                    "h-12",
                                    "w-full",
                                    "rounded-lg",
                                    "border",
                                    "bg-background",
                                    "px-4",
                                    "font-mono",
                                    "text-center",
                                    "text-lg",
                                    "font-semibold",
                                    "tracking-[0.25em]",
                                    "outline-none",
                                    "transition",
                                    "placeholder:text-muted-foreground",
                                    "placeholder:tracking-[0.25em]",
                                    "focus:border-primary",
                                    "focus:ring-2",
                                    "focus:ring-primary/20"
                                )}
                            />

                            <p
                                className={cn(
                                    "mt-2",
                                    "text-xs",
                                    "text-muted-foreground"
                                )}
                            >
                                Enter the code displayed in your Cognivex
                                terminal.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className={cn(
                                    "mt-4",
                                    "rounded-lg",
                                    "border",
                                    "border-destructive/30",
                                    "bg-destructive/5",
                                    "px-3",
                                    "py-2",
                                    "text-sm",
                                    "text-destructive"
                                )}
                            >
                                {error}
                            </div>
                        )}

                        {/* Continue */}
                        <button
                            type="submit"
                            disabled={
                                isLoading ||
                                userCode.trim().length < 8
                            }
                            className={cn(
                                "mt-6",
                                "flex",
                                "h-11",
                                "w-full",
                                "items-center",
                                "justify-center",
                                "gap-2",
                                "rounded-lg",
                                "bg-primary",
                                "px-4",
                                "text-sm",
                                "font-medium",
                                "text-primary-foreground",
                                "transition",
                                "hover:bg-primary/90",
                                "disabled:pointer-events-none",
                                "disabled:opacity-50"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2
                                        className={cn(
                                            "h-4",
                                            "w-4",
                                            "animate-spin"
                                        )}
                                    />

                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Continue

                                    <ArrowRight className={cn('h-4', 'w-4')} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p
                    className={cn(
                        "mt-6",
                        "text-center",
                        "text-xs",
                        "text-muted-foreground"
                    )}
                >
                    Only authorize Cognivex if you initiated this
                    request from your own terminal.
                </p>
            </div>
        </main>
    );
};

export default Page;