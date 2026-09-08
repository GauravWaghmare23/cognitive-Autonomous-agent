import {
  cancel,
  confirm,
  intro,
  outro,
  isCancel,
} from "@clack/prompts";

import { logger } from "better-auth";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";

import chalk from "chalk";
import { Command } from "commander";
import open from "open";
import path from "node:path";
import ora from "ora";

import {
  CONFIG_DIR,
  TOKEN_FILE,
  clearStoredToken,
  getStoredToken,
  isTokenExpired,
  requireAuth,
  storeToken,
} from "../../../config/token.js";
import { prisma } from "../../../config/database.js";

const DEFAULT_SERVER_URL = process.env.AUTH_URL || "http://localhost:4000";
const DEFAULT_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

const colors = {
  primary: chalk.white,
  secondary: chalk.gray,
  muted: chalk.dim,
  accent: chalk.hex("#22C55E"),
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  bold: chalk.bold,
};


function printDivider() {
  console.log(colors.muted("─".repeat(54)));
}

function printLabel(label, value) {
  console.log(
    `  ${colors.secondary(label.padEnd(14))}${colors.primary(value)}`
  );
}

function formatTime(seconds) {
  if (!seconds) return "unknown";

  const minutes = Math.floor(seconds / 60);

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m`;
}


export async function loginAction(opts) {
  const serverUrl = opts.serverUrl || DEFAULT_SERVER_URL;
  const clientId = opts.clientId || DEFAULT_CLIENT_ID;

  if (!clientId) {
    console.error(
      colors.error(
        "\n✕ GitHub client ID is not configured."
      )
    );

    console.error(
      colors.secondary(
        "  Set GITHUB_CLIENT_ID in your .env file."
      )
    );

    process.exit(1);
  }

  intro(
    `${colors.primary("ARC")} ${colors.secondary("·")} ${colors.bold(
      "Authentication"
    )}`
  );

  // --------------------------------------------------
  // Existing authentication
  // --------------------------------------------------

  const existingToken = await getStoredToken();
  const expired = await isTokenExpired();

  if (existingToken && !expired) {
    const shouldReAuth = await confirm({
      message: "You are already logged in. Sign in again?",
      initialValue: false,
    });

    if (isCancel(shouldReAuth) || !shouldReAuth) {
      cancel("Login cancelled");
      return;
    }
  }

  // --------------------------------------------------
  // Authentication client
  // --------------------------------------------------

  const authClient = createAuthClient({
    baseURL: serverUrl,
    plugins: [deviceAuthorizationClient()],
  });

  // --------------------------------------------------
  // Request device code
  // --------------------------------------------------

  const requestSpinner = ora({
    text: "Preparing device authorization",
    color: "green",
  }).start();

  try {
    const { data, error } = await authClient.device.code({
      client_id: clientId,
      scope: "openid profile email",
    });

    if (error || !data) {
      requestSpinner.fail("Could not start device authorization");

      logger.error(
        `Device authorization failed: ${error?.error_description || "Unknown error"
        }`
      );

      return;
    }

    requestSpinner.succeed("Device authorization ready");

    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      interval = 5,
      expires_in,
    } = data;

    const verificationUrl =
      verification_uri_complete || verification_uri;

    console.log();

    printDivider();

    console.log(
      `  ${colors.bold("Authorize this device")}`
    );

    console.log();

    printLabel("Device code", user_code);
    printLabel("Expires in", formatTime(expires_in));
    printLabel("Server", serverUrl);

    console.log();

    console.log(
      `  ${colors.secondary("Open")} ${colors.primary(
        verificationUrl
      )}`
    );

    printDivider();

    console.log();

    // --------------------------------------------------
    // Browser
    // --------------------------------------------------

    const openBrowser = await confirm({
      message: "Open the authorization page in your browser?",
      initialValue: true,
    });

    if (isCancel(openBrowser)) {
      cancel("Login cancelled");
      return;
    }

    if (openBrowser) {
      const browserSpinner = ora({
        text: "Opening authorization page",
        color: "green",
      }).start();

      try {
        await open(verificationUrl);

        browserSpinner.succeed(
          "Authorization page opened"
        );
      } catch (error) {
        browserSpinner.warn(
          "Could not open the browser automatically"
        );

        console.log();
        console.log(
          `  ${colors.secondary("Open manually:")}`
        );

        console.log(
          `  ${colors.primary(verificationUrl)}`
        );
      }
    }

    console.log();

    console.log(
      `  ${colors.secondary(
        "Waiting for you to approve this device"
      )}`
    );

    console.log();

    // --------------------------------------------------
    // Poll
    // --------------------------------------------------

    const token = await pollForToken(
      authClient,
      device_code,
      clientId,
      interval
    );

    if (!token) {
      return;
    }

    // --------------------------------------------------
    // Save token
    // --------------------------------------------------

    const saveSpinner = ora({
      text: "Saving authentication",
      color: "green",
    }).start();

    const saved = await storeToken(token);

    if (!saved) {
      saveSpinner.fail("Authentication completed, but token could not be saved");

      console.log();

      console.log(
        colors.warning(
          "⚠ You may need to authenticate again next time."
        )
      );

      return;
    }

    saveSpinner.succeed("Authentication saved");

    console.log();

    printDivider();

    console.log();

    console.log(
      `  ${colors.success("✓")} ${colors.bold(
        "You are now signed in to ARC"
      )}`
    );

    console.log();

    console.log(
      `  ${colors.secondary("Credentials stored locally at")}`
    );

    console.log(
      `  ${colors.primary(TOKEN_FILE)}`
    );

    console.log();

    printDivider();

    outro(
      `${colors.success("ARC is ready.")}`
    );

  } catch (error) {
    requestSpinner.stop();

    console.error();

    console.error(
      colors.error(
        `✕ Login failed: ${error?.message || "Unknown error"}`
      )
    );

    process.exit(1);
  }
}

async function pollForToken(
  authClient,
  deviceCode,
  clientId,
  initialInterval
) {
  let pollingInterval = initialInterval;

  const spinner = ora({
    text: "Waiting for authorization",
    color: "green",
  });

  return new Promise((resolve, reject) => {
    const poll = async () => {
      if (!spinner.isSpinning) {
        spinner.start();
      }

      try {
        const { data, error } =
          await authClient.device.token({
            grant_type:
              "urn:ietf:params:oauth:grant-type:device_code",

            device_code: deviceCode,

            client_id: clientId,

            fetchOptions: {
              headers: {
                "user-agent": "ARC-CLI",
              },
            },
          });

        // --------------------------------------------
        // Success
        // --------------------------------------------

        if (data?.access_token) {
          spinner.succeed(
            "Device authorization approved"
          );

          resolve(data);
          return;
        }

        // --------------------------------------------
        // Error handling
        // --------------------------------------------

        if (error) {
          switch (error.error) {
            case "authorization_pending":
              spinner.text =
                "Waiting for authorization";
              break;

            case "slow_down":
              pollingInterval += 5;

              spinner.text =
                "Authorization is taking longer than expected";

              break;

            case "access_denied":
              spinner.fail(
                "Device authorization denied"
              );

              reject(
                new Error(
                  "The device authorization was denied."
                )
              );

              return;

            case "expired_token":
              spinner.fail(
                "Device authorization expired"
              );

              reject(
                new Error(
                  "The device authorization code has expired."
                )
              );

              return;

            default:
              spinner.fail(
                "Device authorization failed"
              );

              reject(
                new Error(
                  error.error_description ||
                  "Unknown authorization error"
                )
              );

              return;
          }
        }

        setTimeout(
          poll,
          pollingInterval * 1000
        );

      } catch (error) {
        spinner.fail("Network error");

        reject(
          new Error(
            error?.message ||
            "Unable to communicate with the authentication server."
          )
        );
      }
    };

    // First poll
    setTimeout(
      poll,
      pollingInterval * 1000
    );
  });
}

export async function logoutAction() {
  intro(colors.bold("ARC Logout"));

  const token = await getStoredToken();

  if (!token) {
    console.log(colors.warning("⚠ You are not logged in."));
    process.exit(0);
  }

  const shouldLogout = await confirm({
    message: `You are currently logged in as ${colors.bold(
      token.email
    )}. Are you sure you want to logout?`,
    initialValue: true,
  });

  if (isCancel(shouldLogout) || !shouldLogout) {
    cancel("No problem. Logout cancelled.");
    process.exit(0);
  }

  const cleared = await clearStoredToken();

  if (cleared) {
    outro(`${colors.success("✓")} Logged out successfully`);
    process.exit(0);
  } else {
    outro(colors.error("✕ Failed to logout."));
    process.exit(1);
  }
}

export async function whoAmIAction() {
  const token = await requireAuth();

  if (!token?.access_token) {
    console.log(colors.error("✕ You are not logged in."));
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: {
          token: token.access_token,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    console.log(colors.error("✕ Unable to find the authenticated user."));
    process.exit(1);
  }

  console.log();
  console.log(`  ${colors.bold("Signed in as")}`);
  console.log();

  printLabel("Name", user.name);
  printLabel("Email", user.email);
  printLabel("ID", user.id);

  console.log();
}

export const login = new Command("login")
  .description("Authenticate your ARC CLI")
  .option(
    "--server-url <url>",
    "ARC authentication server URL",
    DEFAULT_SERVER_URL
  )
  .option(
    "--client-id <id>",
    "OAuth client ID",
    DEFAULT_CLIENT_ID
  )
  .action(loginAction);

export const logout = new Command("logout")
  .description("Logout and clear stored credentials")
  .action(logoutAction);

export const whoami = new Command("whoami")
  .description("Show current authenticated user")
  .option(
    "--server-url <url>",
    "The Better Auth server URL",
    URL
  )
  .action(whoAmIAction);