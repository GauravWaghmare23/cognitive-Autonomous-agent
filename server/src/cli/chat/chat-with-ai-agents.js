import chalk from "chalk";
import boxen from "boxen";
import { text, isCancel, cancel, intro, outro, confirm } from "@clack/prompts";
import { AIService } from "../ai/google-service.js";
import { ChatService } from "../../service/chat.service.js";
import { getStoredToken } from "../../config/token.js";
import { prisma } from "../../config/database.js";
import { generateApplication } from "../../config/agent.config.js";

const aiService = new AIService();
const chatService = new ChatService();


marked.use(
    markedTerminal({
        // Styling options for terminal output
        code: chalk.cyan,
        blockquote: chalk.gray.italic,
        heading: chalk.green.bold,
        firstHeading: chalk.hex("#22C55E").bold,
        hr: chalk.dim,
        listitem: chalk.reset,
        list: chalk.reset,
        paragraph: chalk.reset,
        strong: chalk.bold,
        em: chalk.italic,
        codespan: chalk.cyan,
        del: chalk.dim.gray.strikethrough,
        link: chalk.cyan.underline,
        href: chalk.cyan.underline,
    })
);


async function getUserFromToken() {
    const token = await getStoredToken();

    if (!token?.access_token) {
        throw new Error(
            "Not authenticated. Please run 'arc login' first."
        );
    }

    const spinner = ora({
        text: secondary("Authenticating..."),
        spinner: "dots",
    }).start();

    try {
        const user = await prisma.user.findFirst({
            where: {
                sessions: {
                    some: {
                        token: token.access_token,
                    },
                },
            },
        });

        if (!user) {
            spinner.fail("Authentication failed");

            throw new Error(
                "No authenticated user found. Please run 'arc login' again."
            );
        }

        spinner.succeed(`Welcome back, ${chalk.bold(user.name)}`);

        return user;
    } catch (error) {
        if (spinner.isSpinning) {
            spinner.fail("Authentication failed");
        }

        throw error;
    }
}


export async function initConversation(
    userId,
    conversationId = null,
    mode = "agent"
) {
    const spinner = ora({
        text: secondary("Loading conversation..."),
        spinner: "dots",
    }).start();

    const conversation =
        await chatService.getOrCreateConversation(
            userId,
            conversationId,
            mode
        );

    spinner.succeed("Conversation loaded");


    console.log();
    console.log(`  ${accent("●")} ${chalk.bold(conversation.title)}`);
    console.log(
        `  ${muted(conversation.id)}  ${muted("·")}  ${muted(`mode: ${conversation.mode}`)}`
    );
    console.log(hr());

    if (conversation.messages?.length > 0) {
        displayMessages(conversation.messages);
    }

    return conversation;
}


async function saveMessage(conversationId, role, content) {
    return await chatService.addMessage(conversationId, role, content);
}

export async function startAgentChat(conversationId, mode = "agent") {

    try {

        intro(
            boxen(
                chalk.bold.magenta("🤖 ARC - Agent Mode\n\n") +
                chalk.gray("Autonomous Application Generator"),
                {
                    padding: 1,
                    borderStyle: "double",
                    borderColor: "magenta",
                }
            )
        );

        const user = await getUserFromToken();

        const shouldContinue = await confirm({
            message: chalk.yellow(
                "⚠️  The agent will create files and folders in the current directory. Continue?"
            ),
            initialValue: true,
        });

        if (isCancel(shouldContinue) || !shouldContinue) {
            cancel(chalk.yellow("Agent mode cancelled"));
            process.exit(0);
        }

        const conversation = await initConversation(
            user.id,
            conversationId,
            mode
        )

        await agentLoop(conversation);

        outro(chalk.green.bold("\n✨ Thanks for using Agent Mode!"));


    } catch (error) {
        console.log();
        console.log(
            `  ${chalk.red("✕")} ${chalk.red(error.message)}`
        );
        console.log();
        process.exit(1);
    }
}