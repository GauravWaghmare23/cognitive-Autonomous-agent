import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { getStoredToken } from "../../../config/token.js";
import { prisma } from "../../../config/database.js";
import { select } from "@clack/prompts";
import { startChat } from "../../chat/chat-with-ai.js";
import { startToolChat } from "../../chat/chat-with-ai-tools.js";
import { startAgentChat } from "../../chat/chat-with-ai-agents.js";
import { startExplorerAgent } from "../../chat/chat-with-ai-explorer.js";


// --------------------------------------------------
// CLI Theme
// --------------------------------------------------

const accent = chalk.hex("#22C55E");
const white = chalk.white;
const secondary = chalk.gray;
const muted = chalk.dim;
const error = chalk.red;


const wakeupAction = async () => {
    const token = await getStoredToken();

    if (!token?.access_token) {
        console.log();
        console.log(error("  ✕ Not authenticated."));
        console.log(`  ${secondary("Run")} ${white("arc login")} ${secondary("first.")}`);
        console.log();
        return;
    }

    const spinner = ora({
        text: secondary("Fetching your account..."),
        spinner: "line",
    }).start();

    const user = await prisma.user.findFirst({
        where: {
            sessions: {
                some: {
                    token: token.access_token
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
        }
    });

    if (!user) {
        spinner.fail("No authenticated user found");
        console.log(`  ${secondary("Run")} ${white("arc login")} ${secondary("again.")}`);
        console.log();
        return;
    }

    spinner.succeed(`Welcome back, ${chalk.bold(user.name)}`);

    console.log();

    const choice = await select({
        message: "Select an option",
        options: [
            {
                value: "Chat",
                label: "Chat",
                hint: "Simple chat with AI",
            },
            {
                value: "Tool",
                label: "Tool Calling",
                hint: "Chat with tools (Google Search, Code Execution)",
            },
            {
                value: "Application",
                label: "Application Agent",
                hint: "Generate complete applications from your ideas",
            },
            {
                value: "Explorer",
                label: "Explorer Agent",
                hint: "Explore, read, create and modify workspace files",
            },
        ],
    });

    switch (choice) {
        case "Chat":
            startChat();
            break;

        case "Tool":
            await startToolChat();
            break;
        case "Application":
            await startAgentChat();
            break;
        case "Explorer":
            await startExplorerAgent();
            break;
    }
}


export const wakeup = new Command("wakeup")
    .description("Wakeup ARC AI and start conversation.")
    .action(wakeupAction);