import chalk from "chalk";
import boxen from "boxen";
import ora from "ora";
import { text, isCancel, cancel, intro, outro, confirm } from "@clack/prompts";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";

import { AIService } from "../ai/google-service.js";
import { ChatService } from "../../service/chat.service.js";
import { getStoredToken } from "../../config/token.js";
import { prisma } from "../../config/database.js";
import { generateApplication } from "../../config/agent.config.js";

const chatService = new ChatService();
const aiService = new AIService();

marked.use(
    markedTerminal({
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

const accent = chalk.hex("#22C55E");
const secondary = chalk.gray;
const muted = chalk.dim;
const rose = chalk.hex("#F87171");
const amber = chalk.hex("#FBBF24");

const divider = () => muted(`  ${"─".repeat(54)}`);

function indentBlock(content, spaces = 4) {
    const pad = " ".repeat(spaces);

    return content
        .split("\n")
        .map((line) => (line.length ? pad + line : line))
        .join("\n");
}

function renderUserMessage(content) {
    console.log();
    console.log(`  ${chalk.cyan("›")} ${chalk.bold("You")}`);
    console.log(indentBlock(content));
}

function renderAssistantMessage(content) {
    console.log();
    console.log(`  ${accent("›")} ${chalk.bold("Assistant")}`);

    const rendered = marked.parse(content).trim();

    console.log(indentBlock(rendered));
}

function displayMessages(messages) {
    messages.forEach((msg) => {
        if (msg.role === "user") {
            renderUserMessage(msg.content);
        } else {
            renderAssistantMessage(msg.content);
        }
    });

    console.log();
    console.log(divider());
}

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

        spinner.succeed(
            `Welcome back, ${chalk.bold(user.name)}`
        );

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

    console.log(
        `  ${accent("●")} ${chalk.bold(conversation.title)}`
    );

    console.log(
        `  ${muted(`id ${conversation.id}`)}  ` +
        `${muted("·")}  ` +
        `${muted(`mode ${conversation.mode}`)}`
    );

    console.log(divider());

    if (conversation.messages?.length > 0) {
        displayMessages(conversation.messages);
    }

    return conversation;
}

async function saveMessage(
    conversationId,
    role,
    content
) {
    return await chatService.addMessage(
        conversationId,
        role,
        content
    );
}

async function updateConversationTitle(
    conversationId,
    userInput,
    messageCount
) {
    if (messageCount === 1) {
        const title =
            userInput.slice(0, 50) +
            (userInput.length > 50 ? "..." : "");

        await chatService.updateTitle(
            conversationId,
            title
        );
    }
}

function printExit(message = "Agent session ended") {
    console.log();

    console.log(
        `  ${accent("✓")} ${secondary(message)}`
    );

    console.log();
}

async function generateAgentApplication(
    conversation,
    userInput
) {
    const spinner = ora({
        text: secondary("Agent is generating your application..."),
        spinner: "dots",
    }).start();

    try {
        const result = await generateApplication(
            userInput,
            aiService,
            process.cwd()
        );

        spinner.stop();

        if (!result || !result.success) {
            throw new Error(
                "The agent failed to generate the application."
            );
        }

        console.log();

        console.log(
            `  ${accent("◇")} ${chalk.bold("Application Generated")}`
        );

        console.log();

        console.log(
            indentBlock(
                `${chalk.bold("Project:")} ${result.folderName}\n` +
                `${chalk.bold("Files:")} ${result.files.length}\n` +
                `${chalk.bold("Location:")} ${result.appDir}`
            )
        );

        console.log();

        if (result.commands?.length > 0) {
            console.log(
                `  ${amber("▸")} ${chalk.bold("Setup Commands")}`
            );

            console.log();

            console.log(
                indentBlock(
                    result.commands
                        .map((command) => chalk.cyan(command))
                        .join("\n")
                )
            );
        }

        console.log();
        console.log(divider());
        console.log();

        const responseMessage =
            `Generated application: ${result.folderName}\n` +
            `Files created: ${result.files.length}\n` +
            `Location: ${result.appDir}\n\n` +
            `Setup commands:\n${result.commands.join("\n")}`;

        await saveMessage(
            conversation.id,
            "assistant",
            responseMessage
        );

        return result;
    } catch (error) {
        spinner.fail("Application generation failed");

        throw error;
    }
}

async function agentLoop(conversation) {
    const helpRows = [
        ["Enter", "Generate application"],
        ["exit", "End the session"],
        ["Ctrl+C", "Quit anytime"],
    ];

    const helpBox = boxen(
        helpRows
            .map(
                ([key, desc]) =>
                    `${muted(key.padEnd(8))}${secondary(desc)}`
            )
            .join("\n"),
        {
            padding: {
                left: 1,
                right: 1,
                top: 0,
                bottom: 0,
            },
            margin: {
                top: 1,
                bottom: 1,
            },
            borderStyle: "round",
            borderColor: "gray",
            dimBorder: true,
        }
    );

    console.log(helpBox);

    while (true) {
        const userInput = await text({
            message: chalk.cyan("Message"),
            placeholder: "Describe your application...",
            validate(value) {
                if (
                    !value ||
                    value.trim().length === 0
                ) {
                    return "Message cannot be empty";
                }
            },
        });

        if (isCancel(userInput)) {
            printExit();
            process.exit(0);
        }

        if (userInput.toLowerCase() === "exit") {
            printExit();
            break;
        }

        await saveMessage(
            conversation.id,
            "user",
            userInput
        );

        const messages =
            await chatService.getMessages(
                conversation.id
            );

        try {
            await generateAgentApplication(
                conversation,
                userInput
            );

            await updateConversationTitle(
                conversation.id,
                userInput,
                messages.length
            );

            const continuePrompt = await confirm({
                message: chalk.yellow(
                    "Would you like to generate another application?"
                ),
                initialValue: false,
            });

            if (
                isCancel(continuePrompt) ||
                !continuePrompt
            ) {
                printExit();
                break;
            }
        } catch (error) {
            console.log(
                chalk.red(
                    `\n❌ Error: ${error.message}\n`
                )
            );

            await saveMessage(
                conversation.id,
                "assistant",
                `Error: ${error.message}`
            );

            const retry = await confirm({
                message: chalk.cyan(
                    "Would you like to try again?"
                ),
                initialValue: true,
            });

            if (isCancel(retry) || !retry) {
                printExit();
                break;
            }
        }
    }
}

export async function startAgentChat(
    conversationId = null,
    mode = "agent"
) {
    try {
        intro(
            boxen(
                chalk.bold.magenta(
                    "🤖 ARC · Agent Mode\n\n"
                ) +
                chalk.gray(
                    "Autonomous Application Generator"
                ),
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

        if (
            isCancel(shouldContinue) ||
            !shouldContinue
        ) {
            cancel(
                chalk.yellow(
                    "Agent mode cancelled"
                )
            );

            process.exit(0);
        }

        const conversation =
            await initConversation(
                user.id,
                conversationId,
                mode
            );

        await agentLoop(conversation);

        outro(
            chalk.green.bold(
                "\n✨ Thanks for using Agent Mode!"
            )
        );
    } catch (error) {
        console.log();

        console.log(
            `  ${rose("✕")} ${rose(error.message)}`
        );

        console.log();

        process.exit(1);
    }
}