import { DocPage } from "../types";

export const agentsToolCallingPage: DocPage = {
  slug: "agents/tool-calling",
  group: "agents",
  title: "Tool Calling Agent",
  description: "Chat augmented with native Google Gemini tools for search, Python execution, and URL analysis.",
  blocks: [
    {
      type: "paragraph",
      text: "Tool Calling mode augments the conversational experience with Google Gemini's native client-side and cloud tools. When entering this mode, you multiselect which tools to enable.",
    },
    {
      type: "heading",
      level: 2,
      id: "available-tools",
      text: "Available Native Tools",
    },
    {
      type: "paragraph",
      text: "Cognivex registers three native tools directly from `@ai-sdk/google`:",
    },
    {
      type: "table",
      headers: ["Tool ID", "Name", "Implementation & Description"],
      rows: [
        [
          "google_search",
          "Google Search",
          "`google.tools.googleSearch({})` — Access real-time information, news, and current events via Google Search."
        ],
        [
          "code_execution",
          "Code Execution",
          "`google.tools.codeExecution({})` — Generate and execute Python code in a sandboxed runtime to perform math or data calculations."
        ],
        [
          "url_context",
          "URL Context",
          "`google.tools.urlContext({})` — Analyze up to 20 specific URLs directly provided in the prompt."
        ],
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "execution-mechanics",
      text: "Execution Mechanics",
    },
    {
      type: "paragraph",
      text: "Cognivex passes the enabled tool instances to the AI SDK during stream generation.",
    },
    {
      type: "callout",
      tone: "info",
      title: "Single-Step Tool Calls",
      text: "Tool Calling mode configures `stopWhen: stepCountIs(1)`. This means tool invocations are handled in a single execution step rather than an iterative multi-turn autonomous loop.",
    },
    {
      type: "heading",
      level: 2,
      id: "tool-selection-flow",
      text: "Tool Activation Flow",
    },
    {
      type: "flow",
      steps: [
        "Select 'Tool Calling' from cognivex wakeup menu",
        "Multiselect checkboxes for desired tools (Google Search, Code Execution, URL Context)",
        "Prompt sent with active tools enabled in AI SDK options",
        "Model calls tool natively if required by the prompt",
        "Single-step tool output incorporated into final response",
      ],
      caption: "Tool Calling initialization and execution",
    },
  ],
};
