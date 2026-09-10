import { DocPage } from "../types";

export const agentsChatPage: DocPage = {
  slug: "agents/chat",
  group: "agents",
  title: "Chat Agent",
  description: "Standard conversational AI streaming directly in your terminal.",
  blocks: [
    {
      type: "paragraph",
      text: "Chat mode provides a streamlined, direct conversational interface with the underlying language model without attaching external tools or local filesystem inspection agents.",
    },
    {
      type: "heading",
      level: 2,
      id: "how-it-works",
      text: "How It Works",
    },
    {
      type: "paragraph",
      text: "In Chat mode, user prompts are sent via `AIService.sendMessage`. The response is streamed token-by-token directly to `process.stdout` for low latency.",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Conversation History: The entire conversation history is accumulated in memory and passed on every turn.",
        "Automatic Session Naming: The first user prompt in a session is automatically truncated to 50 characters and used as the conversation title in the database.",
        "Exit Commands: Type `exit` or press Ctrl+C to terminate the active chat session.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "flow-diagram",
      text: "Message Flow",
    },
    {
      type: "flow",
      steps: [
        "User inputs prompt in terminal",
        "Prompt appended to active history array",
        "AIService.sendMessage sends complete history to Google AI SDK",
        "Streamed chunks printed to terminal with chalk formatting",
        "Full response appended to history for subsequent turns",
      ],
      caption: "Interactive Chat Turn Lifecycle",
    },
    {
      type: "callout",
      tone: "info",
      title: "Pure Context Window",
      text: "Chat mode does not invoke external tool definitions or search the local filesystem. For grounding in current internet data or local files, choose Tool Calling or Explorer Agent.",
    },
  ],
};
