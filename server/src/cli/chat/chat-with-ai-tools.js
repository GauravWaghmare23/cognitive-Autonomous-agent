import chalk from "chalk";
import boxen from "boxen";
import {
    text,
    isCancel,
    cancel,
    intro,
    outro,
    multiselect
} from "@clack/prompts";
import ora from "ora";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { AIService } from "../ai/google-service.js";
import { ChatService } from "../../service/chat.service.js";
import { getStoredToken } from "../../config/token.js";
import { prisma } from "../../config/database.js";
import {
    availableTools,
    getEnabledTools,
    enableTools,
    getEnabledToolNames,
    resetTools
} from "../../config/tool.config.js";


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

const chatService = new ChatService();
const aiService = new AIService();

const accent = chalk.hex("#22C55E");
const secondary = chalk.gray;
const muted = chalk.dim;

const divider = () => muted(`  ${"─".repeat(54)}`);

function indentBlock(text, spaces = 4) {
    const pad = " ".repeat(spaces);

    return text
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



async function selectTools() {

    const toolOptions = availableTools.map(tool => ({
        value: tool.id,
        label: tool.name,
        hint: tool.description
    }));

    const selectedTools = await multiselect({
        message: "Select tools to enable",
        options: toolOptions,
        required: false,
    });

    if (isCancel(selectedTools)) {
        cancel("Tool selection cancelled");
        process.exit(0);
    }

    enableTools(selectedTools);

    console.log();

    if (selectedTools.length === 0) {
        console.log(
            `  ${muted("No tools enabled — the AI will respond without tool access.")}`
        );
    } else {
        console.log(`  ${chalk.bold("Enabled tools")}`);

        selectedTools.forEach((id) => {
            const tool = availableTools.find(
                (t) => t.id === id
            );

            console.log(`  ${accent("✓")} ${tool.name}`);
        });
    }

    console.log();

    return selectedTools.length > 0

}


async function initConversation(userId, conversationId = null, mode = "tool") {

    const spinner = ora({
        text: secondary("Loading conversation..."),
        spinner: "dots",
    }).start();

    const conversation = await chatService.getOrCreateConversation(
        userId,
        conversationId,
        mode
    );

    spinner.succeed("Conversation loaded");

    const enabledToolNames = getEnabledToolNames();

    console.log();
    console.log(`  ${chalk.bold(conversation.title)}`);
    console.log(
        `  ${muted(`id ${conversation.id}`)}  ${muted("·")}  ${muted(
            `mode ${conversation.mode}`
        )}`
    );
    console.log(
        `  ${muted(
            enabledToolNames.length > 0
                ? `tools ${enabledToolNames.join(", ")}`
                : "tools none"
        )}`
    );
    console.log(divider());

    if (conversation.messages?.length > 0) {
        displayMessages(conversation.messages);
    }

    return conversation;

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

async function getAIResponse(conversationId) {
    const spinner = ora({
        text: secondary("Thinking..."),
        spinner: "dots",
        color: "green",
    }).start();

    const dbMessages =
        await chatService.getMessages(conversationId);

    const aiMessages =
        chatService.formatMessagesForAI(dbMessages);

    const tools = getEnabledTools();

    let fullResponse = "";

    let isFirstChunk = true;

    try {
        const result = await aiService.sendMessage(
            aiMessages,
            (chunk) => {
                if (isFirstChunk) {
                    spinner.stop();

                    console.log();
                    console.log(
                        `  ${accent("›")} ${chalk.bold("Assistant")}`
                    );

                    isFirstChunk = false;
                }

                fullResponse += chunk;
            },
            tools
        );

        // Now render the complete markdown response
        console.log();

        const renderedMarkdown =
            marked.parse(fullResponse).trim();

        console.log(indentBlock(renderedMarkdown));

        console.log();
        console.log(divider());
        console.log();

        return result.content;
    } catch (error) {
        spinner.fail(
            "Failed to get response from AI"
        );

        throw error;
    }
}



function printExit() {
    console.log();
    console.log(
        `  ${accent("✓")} ${secondary("Session ended. See you next time.")}`
    );
    console.log();
}

async function chatLoop(conversation) {
    const enabledToolNames = getEnabledToolNames();

    const helpRows = [
        ["Enter", "Send your message"],
        [
            "Tools",
            enabledToolNames.length > 0
                ? enabledToolNames.join(", ")
                : "none enabled",
        ],
        ["exit", "End the conversation"],
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
            padding: { left: 1, right: 1, top: 0, bottom: 0 },
            margin: { top: 1, bottom: 1 },
            borderStyle: "round",
            borderColor: "gray",
            dimBorder: true,
        }
    );

    console.log(helpBox);

    while (true) {

        const userInput = await text({
            message: chalk.cyan("Message"),
            placeholder: "Type your message...",
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

        if (
            userInput.toLowerCase() === "exit"
        ) {
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

        const aiResponse =
            await getAIResponse(
                conversation.id
            );

        await saveMessage(
            conversation.id,
            "assistant",
            aiResponse
        );

        await updateConversationTitle(
            conversation.id,
            userInput,
            messages.length
        );


    }

}



export async function startToolChat(conversationId = null) {

    try {

        intro(
            `${accent("◆")} ${chalk.bold("ARC · Tool Calling")}`
        );

        const user = await getUserFromToken();

        await selectTools();

        const conversation = await initConversation(user.id, conversationId, "tool");

        await chatLoop(conversation);

        resetTools();

        outro(secondary("Thanks for using tools"));


    } catch (error) {

        console.log();
        console.log(
            `  ${chalk.red("✕")} ${chalk.red(error.message)}`
        );
        console.log();

        resetTools();
        process.exit(1);

    }
}