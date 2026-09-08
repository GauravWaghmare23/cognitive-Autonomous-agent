import chalk from "chalk";
import boxen from "boxen";
import ora from "ora";

import { text, isCancel, cancel, intro, outro } from "@clack/prompts";

import { marked } from "marked";
import { markedTerminal } from "marked-terminal";

import { AIService } from "../ai/google-service.js";
import { ChatService } from "../../service/chat.service.js";
import { getStoredToken } from "../../config/token.js";
import { prisma } from "../../config/database.js";

import { createExplorerTools } from "../../tools/explorer.tools.js";
import { explorerConfig } from "../../config/explorer.config.js";

const chatService = new ChatService();

const aiService = new AIService();

const explorer = createExplorerTools();

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
  }),
);

const accent = chalk.hex("#22C55E");
const secondary = chalk.gray;
const muted = chalk.dim;
const rose = chalk.hex("#F87171");
const amber = chalk.hex("#FBBF24");
const blue = chalk.hex("#60A5FA");

const divider = () => muted(`  ${"─".repeat(58)}`);

function indentBlock(content, spaces = 4) {
  const pad = " ".repeat(spaces);

  return String(content)
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
  console.log(`  ${accent("◆")} ${chalk.bold("ARC Explorer")}`);
  console.log(divider());
  const rendered = marked.parse(content).trim();
  console.log(indentBlock(rendered));
  console.log();
}

function displayMessages(messages) {
  messages.forEach((msg) => {
    if (msg.role === "user") {
      renderUserMessage(msg.content);
    } else {
      renderAssistantMessage(msg.content);
    }
  });

  console.log(divider());
}

async function getUserFromToken() {
  const token = await getStoredToken();

  if (!token?.access_token) {
    throw new Error("Not authenticated. Please run 'arc login' first.");
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
        "No authenticated user found. Please run 'arc login' again.",
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
  mode = "explorer",
) {
  const spinner = ora({
    text: secondary("Loading conversation..."),

    spinner: "dots",
  }).start();

  const conversation = await chatService.getOrCreateConversation(
    userId,
    conversationId,
    mode,
  );

  spinner.succeed("Conversation loaded");

  console.log();

  console.log(`  ${accent("●")} ${chalk.bold(conversation.title)}`);

  console.log(
    `  ${muted(`id ${conversation.id}`)}  ${muted("·")}  ${muted(
      `mode ${conversation.mode}`,
    )}`,
  );

  console.log(divider());

  if (conversation.messages?.length > 0) {
    displayMessages(conversation.messages);
  }

  return conversation;
}

async function saveMessage(conversationId, role, content) {
  return await chatService.addMessage(conversationId, role, content);
}

async function updateConversationTitle(
  conversationId,
  userInput,
  messageCount,
) {
  if (messageCount === 1) {
    const title = userInput.slice(0, 50) + (userInput.length > 50 ? "..." : "");

    await chatService.updateTitle(conversationId, title);
  }
}

function printExit(message = "Explorer session ended") {
  console.log();

  console.log(`  ${accent("✓")} ${secondary(message)}`);

  console.log();
}

function getActionLabel(action) {
  switch (action.action) {
    case "list_directory":
      return `Inspecting directory ${chalk.cyan(action.path || ".")}`;

    case "search_files":
      return `Searching workspace for ${chalk.cyan(`"${action.query}"`)}`;

    case "read_file":
      return `Reading ${chalk.cyan(action.path)}`;

    default:
      return "Analyzing workspace";
  }
}

function printActionComplete(action, result) {
  let detail = "";

  switch (action.action) {
    case "list_directory":
      detail = `${result.entries?.length || 0} entries`;

      break;

    case "search_files":
      detail = `${result.total || 0} matching files`;

      break;

    case "read_file":
      detail = `${result.size || 0} bytes`;

      break;
  }

  console.log(
    `  ${accent("✓")} ${secondary(getActionLabel(action))}` +
      (detail ? muted(` · ${detail}`) : ""),
  );
}

function printTokenUsage(usage) {
  const inputTokens = usage?.inputTokens || 0;

  const outputTokens = usage?.outputTokens || 0;

  const totalTokens = usage?.totalTokens || 0;

  console.log(
    `  ${muted("Tokens")} ${secondary(
      `${inputTokens.toLocaleString()} in · ` +
        `${outputTokens.toLocaleString()} out · ` +
        `${totalTokens.toLocaleString()} total`,
    )}`,
  );
}

async function executeExplorerAction(action) {
  switch (action.action) {
    case "list_directory":
      return await explorer.listDirectory(action.path || ".");

    case "search_files":
      return await explorer.searchFiles(action.query, action.path || ".");

    case "read_file":
      return await explorer.readFile(action.path);

    default:
      throw new Error(`Unsupported Explorer action: ${action.action}`);
  }
}

function printInvestigationHeader(userInput) {
  console.log();

  console.log(
    boxen(
      `${chalk.bold.green("ARC EXPLORER")}\n` +
        `${muted("Autonomous Workspace Investigation")}\n\n` +
        `${chalk.bold("Request")}\n` +
        `${secondary(userInput)}`,

      {
        padding: 1,

        borderStyle: "round",

        borderColor: "green",

        dimBorder: true,
      },
    ),
  );

  console.log();
}

function printExecutionSummary(metrics) {
  const {
    aiCalls,
    toolCalls,
    totalInputTokens,
    totalOutputTokens,
    totalTokens,
    durationSeconds,
  } = metrics;

  console.log();

  console.log(
    boxen(
      `${chalk.bold("Execution Summary")}\n\n` +
        `${secondary("AI calls")}             ${aiCalls}\n` +
        `${secondary("Tool operations")}      ${toolCalls}\n` +
        `${secondary("Duration")}             ${durationSeconds}s\n\n` +
        `${secondary(
          "Input tokens",
        )}        ${totalInputTokens.toLocaleString()}\n` +
        `${secondary(
          "Output tokens",
        )}       ${totalOutputTokens.toLocaleString()}\n` +
        `${secondary("Total tokens")}        ${totalTokens.toLocaleString()}`,

      {
        padding: 1,

        borderStyle: "round",

        borderColor: "gray",

        dimBorder: true,
      },
    ),
  );

  console.log();
}

async function runExplorerAgent(conversation, userInput) {
  printInvestigationHeader(userInput);

  await saveMessage(conversation.id, "user", userInput);

  const databaseMessages = await chatService.getMessages(conversation.id);

  const messages = chatService.formatMessagesForAI(databaseMessages);

  let finalResponse = null;

  // -----------------------------------------
  // METRICS
  // -----------------------------------------

  let aiCalls = 0;

  let toolCalls = 0;

  let totalInputTokens = 0;

  let totalOutputTokens = 0;

  let totalTokens = 0;

  const startedAt = Date.now();

  const spinner = ora({
    text: secondary("Planning investigation..."),

    spinner: "dots",
  }).start();

  try {
    // -----------------------------------------
    // AGENT LOOP
    // -----------------------------------------

    for (let step = 1; step <= explorerConfig.maxSteps; step++) {
      spinner.stop();

      console.log();

      console.log(`  ${blue("●")} ${chalk.bold(`Investigation step ${step}`)}`);

      console.log(
        `  ${muted("ARC is deciding what information it needs next...")}`,
      );

      console.log();

      spinner.start(secondary("Analyzing workspace..."));

      // -----------------------------------------
      // AI DECISION
      // -----------------------------------------

      const aiResult = await aiService.generateExplorerAction(messages);

      const action = aiResult.action;

      const usage = aiResult.usage;

      // -----------------------------------------
      // TRACK AI USAGE
      // -----------------------------------------

      aiCalls++;

      totalInputTokens += usage?.inputTokens || 0;

      totalOutputTokens += usage?.outputTokens || 0;

      totalTokens += usage?.totalTokens || 0;

      spinner.stop();

      printTokenUsage(usage);

      // -----------------------------------------
      // FINISH
      // -----------------------------------------

      if (action.action === "finish") {
        finalResponse = action.response || action.reason;

        console.log();

        console.log(`  ${accent("✓")} ${chalk.bold("Investigation complete")}`);

        break;
      }

      // -----------------------------------------
      // SHOW ACTION
      // -----------------------------------------

      console.log();

      console.log(`  ${amber("▸")} ${getActionLabel(action)}`);

      console.log(`  ${muted(action.reason)}`);

      console.log();

      // -----------------------------------------
      // EXECUTE TOOL
      // -----------------------------------------

      spinner.start(secondary("Executing workspace operation..."));

      const toolResult = await executeExplorerAction(action);

      spinner.stop();

      toolCalls++;

      printActionComplete(action, toolResult);

      // -----------------------------------------
      // WORKING MEMORY
      // -----------------------------------------

      messages.push({
        role: "assistant",

        content: JSON.stringify(action),
      });

      messages.push({
        role: "user",

        content: `
Tool result for action "${action.action}":

${JSON.stringify(toolResult, null, 2)}

Continue investigating the original user request.

Use another action if more information
is required.

If you now have enough information to
answer the original request, use the
"finish" action.

When finishing:

- put the internal action explanation
  in "reason"

- put the complete user-facing Markdown
  answer in "response"
                `,
      });
    }

    // -----------------------------------------
    // MAX STEPS
    // -----------------------------------------

    if (!finalResponse) {
      finalResponse = `## Investigation Incomplete

I reached the maximum exploration limit of **${explorerConfig.maxSteps} steps** before I could confidently complete the request.

Please narrow the request or target a specific project or file.`;
    }

    // -----------------------------------------
    // DURATION
    // -----------------------------------------

    const durationMs = Date.now() - startedAt;

    const durationSeconds = (durationMs / 1000).toFixed(2);

    // -----------------------------------------
    // SAVE FINAL RESPONSE
    // -----------------------------------------

    await saveMessage(conversation.id, "assistant", finalResponse);

    // -----------------------------------------
    // DISPLAY RESPONSE
    // -----------------------------------------

    renderAssistantMessage(finalResponse);

    // -----------------------------------------
    // DISPLAY METRICS
    // -----------------------------------------

    printExecutionSummary({
      aiCalls,

      toolCalls,

      totalInputTokens,

      totalOutputTokens,

      totalTokens,

      durationSeconds,
    });

    return finalResponse;
  } catch (error) {
    spinner.stop();

    throw error;
  }
}

async function explorerLoop(conversation) {
  const helpRows = [
    ["Enter", "Explore workspace"],

    ["exit", "End the session"],

    ["Ctrl+C", "Quit anytime"],
  ];

  const helpBox = boxen(
    helpRows
      .map(([key, desc]) => `${muted(key.padEnd(8))}${secondary(desc)}`)
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
    },
  );

  console.log(helpBox);

  while (true) {
    const userInput = await text({
      message: chalk.cyan("Message"),

      placeholder: "Ask me to explore your workspace...",

      validate(value) {
        if (!value || value.trim().length === 0) {
          return "Message cannot be empty";
        }
      },
    });

    if (isCancel(userInput)) {
      printExit();

      process.exit(0);
    }

    if (userInput.trim().toLowerCase() === "exit") {
      printExit();

      break;
    }

    try {
      const existingMessages = await chatService.getMessages(conversation.id);

      await runExplorerAgent(conversation, userInput);

      await updateConversationTitle(
        conversation.id,
        userInput,
        existingMessages.length,
      );
    } catch (error) {
      console.log();

      console.log(
        boxen(
          `${rose.bold("Explorer Error")}\n\n` + `${rose(error.message)}`,

          {
            padding: 1,

            borderStyle: "round",

            borderColor: "red",
          },
        ),
      );

      await saveMessage(
        conversation.id,
        "assistant",
        `Error: ${error.message}`,
      );
    }
  }
}

export async function startExplorerAgent(
  conversationId = null,
  mode = "explorer",
) {
  try {
    intro(
      boxen(
        chalk.bold.green("🔎 ARC · Explorer Mode\n\n") +
          chalk.gray("Autonomous Workspace Exploration Agent"),

        {
          padding: 1,

          borderStyle: "double",

          borderColor: "green",
        },
      ),
    );

    const user = await getUserFromToken();

    const conversation = await initConversation(user.id, conversationId, mode);

    await explorerLoop(conversation);

    outro(chalk.green.bold("\nExplorer session ended."));
  } catch (error) {
    console.log();

    console.log(`  ${rose("✕")} ${rose(error.message)}`);

    console.log();

    process.exit(1);
  }
}
