import { DocPage } from "../types";

export const toolsUrlContextPage: DocPage = {
  slug: "tools/url-context",
  group: "tools",
  title: "URL Context",
  description: "Native Gemini tool allowing the model to analyze up to 20 URLs directly from your prompt.",
  blocks: [
    {
      type: "paragraph",
      text: "The `url_context` tool allows you to include specific HTTP/HTTPS URLs directly inside your prompts for the model to fetch and analyze.",
    },
    {
      type: "heading",
      level: 2,
      id: "implementation",
      text: "Implementation Details",
    },
    {
      type: "code",
      lang: "javascript",
      label: "tool.config.js",
      code: `{
  id: "url_context",
  name: "URL Context",
  description: "Provide specific URLs that you want the model to analyze directly from the prompt. Supports up to 20 URLs per request.",
  getTool: () => google.tools.urlContext({}),
  enabled: false,
}`,
    },
    {
      type: "heading",
      level: 2,
      id: "capabilities",
      text: "Capabilities and Limits",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Capacity: Supports analyzing up to 20 URLs within a single request prompt.",
        "Direct Ingestion: The model fetches and extracts page content context directly.",
        "Zero Local Dependencies: Requires no local browser daemon or headless Chromium installation.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Targeted Analysis",
      text: "Use URL Context when you want the model to examine a specific GitHub pull request, issue thread, API doc, or article rather than performing broad search queries.",
    },
  ],
};
