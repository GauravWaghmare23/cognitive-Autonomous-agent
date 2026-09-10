import chalk from "chalk";
import boxen from "boxen";
import ora from "ora";
import { text, isCancel, intro, outro } from "@clack/prompts";
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
  console.log(`  ${accent("◆")} ${chalk.bold("Cognivex Explorer")}`);
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
    throw new Error("Not authenticated. Please run 'cognivex login' first.");
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
        "No authenticated user found. Please run 'cognivex login' again.",
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

  try {
    const conversation = await chatService.getOrCreateConversation(
      userId,
      conversationId,
      mode,
    );

    spinner.succeed("Conversation loaded");

    console.log();
    console.log(`  ${accent("●")} ${chalk.bold(conversation.title)}`);

    console.log(
      `  ${muted(`id ${conversation.id}`)}  ` +
        `${muted("·")}  ` +
        `${muted(`mode ${conversation.mode}`)}`,
    );

    console.log(divider());

    if (conversation.messages?.length > 0) {
      displayMessages(conversation.messages);
    }

    return conversation;
  } catch (error) {
    spinner.fail("Failed to load conversation");
    throw error;
  }
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

    case "list_directory_tree":
      return `Exploring directory tree ${chalk.cyan(action.path || ".")}`;

    case "search_files":
      return `Searching workspace for ${chalk.cyan(`"${action.query}"`)}`;

    case "read_file":
      return `Reading ${chalk.cyan(action.path)}`;

    case "write_file":
      return `Writing ${chalk.cyan(action.path)}`;

    case "edit_file":
      return `Editing ${chalk.cyan(action.path)}`;

    case "delete_file":
      return `Deleting ${chalk.cyan(action.path)}`;

    case "finish":
      return "Completing request";

    default:
      return "Analyzing workspace";
  }
}

function printActionComplete(action, result) {
  const success = result?.success !== false;

  let detail = "";

  switch (action.action) {
    case "list_directory":
      detail = `${result.entries?.length || 0} entries`;
      break;

    case "list_directory_tree":
      detail =
        `${result.totalEntries || 0} entries` +
        (result.truncated ? " · result truncated" : "");
      break;

    case "search_files":
      detail = `${result.total || 0} matching files`;
      break;

    case "read_file":
      detail = `${result.size || 0} bytes`;
      break;

    case "write_file":
      detail =
        result.operation === "overwrite"
          ? `overwritten · ${result.size || 0} bytes`
          : `created · ${result.size || 0} bytes`;
      break;

    case "edit_file":
      detail =
        `${result.replacements || 0} replacement` +
        (result.replacements === 1 ? "" : "s") +
        ` · ${result.size || 0} bytes`;
      break;

    case "delete_file":
      detail = `deleted · ${result.size || 0} bytes`;
      break;

    default:
      break;
  }

  console.log(
    `  ${success ? accent("✓") : rose("✕")} ` +
      `${secondary(getActionLabel(action))}` +
      (detail ? muted(` · ${detail}`) : ""),
  );

  /*
   * IMPORTANT:
   *
   * Previously the CLI only displayed "failed".
   * That hid the actual reason.
   *
   * Now every tool failure displays the real error.
   */
  if (!success && result?.error) {
    console.log(`    ${rose("Error:")} ${rose(result.error)}`);
  }
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

/*
 * ==========================================================
 * ACTION VALIDATION
 * ==========================================================
 */

function validateExplorerAction(action) {
  if (!action || !action.action) {
    throw new Error("Explorer returned an invalid action.");
  }

  const validActions = [
    "list_directory",
    "list_directory_tree",
    "search_files",
    "read_file",
    "write_file",
    "edit_file",
    "delete_file",
    "finish",
  ];

  if (!validActions.includes(action.action)) {
    throw new Error(`Unsupported Explorer action: ${action.action}`);
  }

  /*
   * Path validation.
   */

  const pathRequiredActions = [
    "list_directory",
    "list_directory_tree",
    "read_file",
    "write_file",
    "edit_file",
    "delete_file",
  ];

  if (pathRequiredActions.includes(action.action)) {
    if (typeof action.path !== "string" || !action.path.trim()) {
      throw new Error(`${action.action} requires a valid path.`);
    }
  }

  /*
   * Search validation.
   */

  if (action.action === "search_files") {
    if (typeof action.query !== "string" || !action.query.trim()) {
      throw new Error("search_files requires a valid query.");
    }
  }

  /*
   * WRITE VALIDATION
   *
   * This is the critical part.
   */

  if (action.action === "write_file") {
    if (typeof action.content !== "string") {
      throw new Error(
        "write_file requires the complete file content in the content field.",
      );
    }

    if (action.content.trim().length === 0) {
      throw new Error("write_file content cannot be empty.");
    }
  }

  /*
   * EDIT VALIDATION
   */

  if (action.action === "edit_file") {
    if (typeof action.oldText !== "string" || action.oldText.length === 0) {
      throw new Error("edit_file requires oldText.");
    }

    if (typeof action.newText !== "string") {
      throw new Error("edit_file requires newText.");
    }
  }

  /*
   * FINISH VALIDATION
   */

  if (action.action === "finish") {
    if (typeof action.response !== "string" || !action.response.trim()) {
      throw new Error("finish requires a response.");
    }

    if (typeof action.reason !== "string" || !action.reason.trim()) {
      throw new Error("finish requires a reason.");
    }
  }

  return true;
}

/*
 * ==========================================================
 * ACTION EXECUTION
 * ==========================================================
 */

async function executeExplorerAction(action) {
  validateExplorerAction(action);

  switch (action.action) {
    case "list_directory":
      return await explorer.listDirectory(action.path || ".");

    case "list_directory_tree":
      return await explorer.listDirectoryTree(action.path || ".");

    case "search_files":
      return await explorer.searchFiles(action.query, action.path || ".");

    case "read_file":
      return await explorer.readFile(action.path);

    case "write_file":
      return await explorer.writeFile(action.path, action.content);

    case "edit_file":
      return await explorer.editFile(
        action.path,
        action.oldText,
        action.newText,
      );

    case "delete_file":
      return await explorer.deleteFile(action.path);

    default:
      throw new Error(`Unsupported Explorer action: ${action.action}`);
  }
}

/*
 * ==========================================================
 * ERROR RECOVERY MESSAGE
 * ==========================================================
 */

function buildToolFeedback(action, toolResult) {
  const isError = toolResult?.success === false;

  if (isError) {
    return `
EXPLORER TOOL RESULT

The previous workspace operation FAILED.

Action:
${action.action}

Path:
${action.path || "N/A"}

Error:
${toolResult.error || "Unknown error"}

IMPORTANT RECOVERY INSTRUCTIONS:

- Continue working on the ORIGINAL USER REQUEST.
- Do not blindly repeat the same failed action.
- Correct the invalid fields before retrying.
- Never claim that an operation succeeded when it failed.

If the failed operation was write_file and the error indicates missing or invalid content:

1. Generate the complete requested file content yourself.
2. Put the complete content inside the "content" field.
3. Put the filename inside "path".
4. Do not put the file content only in "reason".
5. Do not put the file content only in "response".
6. Retry write_file with actual non-empty content.

A valid write_file action looks like:

{
  "action": "write_file",
  "path": "example.md",
  "query": null,
  "content": "# Example\\n\\nActual complete file content goes here.",
  "oldText": null,
  "newText": null,
  "reason": "Creating the requested file.",
  "response": null
}

Return the next valid action now.
`;
  }

  return `
EXPLORER TOOL RESULT

Action:
${action.action}

Path:
${action.path || "N/A"}

Result:
${JSON.stringify(toolResult, null, 2)}

Continue working on the ORIGINAL USER REQUEST.

Rules:

- Treat the tool result as workspace evidence.
- Do not invent information.
- Do not repeat an action if the result already contains what is needed.
- Use another action only when more information is genuinely required.
- If the request can now be answered, use finish.
- If the user asked for file contents, read the relevant files.
- If the user requested verification after writing or editing, read the file again.
- Never claim a file was created, modified, or deleted unless the tool result confirms success.
- response must contain the complete final user-facing answer when using finish.
- reason must explain why the operation is complete.
`;
}

/*
 * ==========================================================
 * FINISH RECOVERY
 * ==========================================================
 */

function buildFinishValidationFeedback(error) {
  return `
EXPLORER FINISH VALIDATION ERROR

The previous finish action was invalid.

Error:
${error.message}

Continue the ORIGINAL USER REQUEST.

If the requested workspace operation is not complete, perform the necessary workspace action first.

If the operation is complete, return:

{
  "action": "finish",
  "path": null,
  "query": null,
  "content": null,
  "oldText": null,
  "newText": null,
  "reason": "Brief explanation of why the task is complete.",
  "response": "Complete user-facing answer."
}

Do not omit required fields.
`;
}

/*
 * ==========================================================
 * DISPLAY
 * ==========================================================
 */

function printInvestigationHeader(userInput) {
  console.log();

  console.log(
    boxen(
      `${chalk.bold.green("COGNIVEX EXPLORER")}\n` +
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

/*
 * ==========================================================
 * MAIN EXPLORER AGENT
 * ==========================================================
 */

async function runExplorerAgent(conversation, userInput) {
  printInvestigationHeader(userInput);

  await saveMessage(conversation.id, "user", userInput);

  const databaseMessages = await chatService.getMessages(conversation.id);

  const messages = chatService.formatMessagesForAI(databaseMessages);

  let finalResponse = null;

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
    for (let step = 1; step <= explorerConfig.maxSteps; step++) {
      spinner.stop();

      console.log();

      console.log(`  ${blue("●")} ${chalk.bold(`Investigation step ${step}`)}`);

      console.log(
        `  ${muted("Cognivex is deciding what information it needs next...")}`,
      );

      console.log();

      spinner.start(secondary("Analyzing workspace..."));

      /*
       * Ask the model for a structured action.
       */

      const aiResult = await aiService.generateExplorerAction(messages);

      const action = aiResult.action;

      const usage = aiResult.usage;

      aiCalls++;

      totalInputTokens += usage?.inputTokens || 0;

      totalOutputTokens += usage?.outputTokens || 0;

      totalTokens += usage?.totalTokens || 0;

      spinner.stop();

      printTokenUsage(usage);

      /*
       * ======================================================
       * FINISH
       * ======================================================
       */

      if (action.action === "finish") {
        try {
          validateExplorerAction(action);

          finalResponse = action.response.trim();
        } catch (error) {
          console.log();

          console.log(`  ${rose("✕")} ${rose(error.message)}`);

          /*
           * Give the invalid action back to the AI
           * and explicitly explain what was wrong.
           */

          messages.push({
            role: "assistant",
            content: JSON.stringify(action),
          });

          messages.push({
            role: "user",
            content: buildFinishValidationFeedback(error),
          });

          continue;
        }

        console.log();

        console.log(`  ${accent("✓")} ${chalk.bold("Investigation complete")}`);

        break;
      }

      /*
       * ======================================================
       * SHOW ACTION
       * ======================================================
       */

      console.log();

      console.log(`  ${amber("▸")} ${getActionLabel(action)}`);

      console.log(
        `  ${muted(
          action.reason || "Executing the required workspace operation...",
        )}`,
      );

      console.log();

      /*
       * ======================================================
       * EXECUTE TOOL
       * ======================================================
       */

      spinner.start(secondary("Executing workspace operation..."));

      let toolResult;

      try {
        toolResult = await executeExplorerAction(action);
      } catch (error) {
        toolResult = {
          success: false,
          error: error?.message || "Unknown Explorer tool error.",
        };
      }

      spinner.stop();

      toolCalls++;

      printActionComplete(action, toolResult);

      /*
       * ======================================================
       * STORE ACTION IN AGENT MEMORY
       * ======================================================
       */

      messages.push({
        role: "assistant",
        content: JSON.stringify(action),
      });

      /*
       * ======================================================
       * SEND TOOL RESULT BACK TO AI
       * ======================================================
       */

      messages.push({
        role: "user",
        content: buildToolFeedback(action, toolResult),
      });
    }

    /*
     * ========================================================
     * MAX STEPS
     * ========================================================
     */

    if (!finalResponse) {
      finalResponse = `## Investigation Incomplete

I reached the maximum exploration limit of **${explorerConfig.maxSteps} steps** before I could confidently complete the request.

No unverified operation has been reported as successful.`;
    }

    const durationMs = Date.now() - startedAt;

    const durationSeconds = (durationMs / 1000).toFixed(2);

    await saveMessage(conversation.id, "assistant", finalResponse);

    renderAssistantMessage(finalResponse);

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

/*
 * ==========================================================
 * EXPLORER CLI LOOP
 * ==========================================================
 */

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
        boxen(`${rose.bold("Explorer Error")}\n\n${rose(error.message)}`, {
          padding: 1,
          borderStyle: "round",
          borderColor: "red",
        }),
      );

      await saveMessage(
        conversation.id,
        "assistant",
        `Error: ${error.message}`,
      );
    }
  }
}

/*
 * ==========================================================
 * PUBLIC ENTRY POINT
 * ==========================================================
 */

export async function startExplorerAgent(
  conversationId = null,
  mode = "explorer",
) {
  try {
    intro(
      boxen(
        chalk.bold.green("🔎 COGNIVEX · Explorer Mode\n\n") +
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
