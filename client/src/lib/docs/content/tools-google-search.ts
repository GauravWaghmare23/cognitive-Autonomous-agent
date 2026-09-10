import { DocPage } from "../types";

export const toolsGoogleSearchPage: DocPage = {
  slug: "tools/google-search",
  group: "tools",
  title: "Google Search",
  description: "Native Gemini tool for grounding model responses in real-time web search results.",
  blocks: [
    {
      type: "paragraph",
      text: "The `google_search` tool leverages Google Gemini's native search grounding capabilities via `@ai-sdk/google`.",
    },
    {
      type: "heading",
      level: 2,
      id: "implementation",
      text: "Implementation Details",
    },
    {
      type: "paragraph",
      text: "Cognivex delegates the tool implementation directly to Gemini without custom intermediary scraping logic:",
    },
    {
      type: "code",
      lang: "javascript",
      label: "tool.config.js",
      code: `{
  id: "google_search",
  name: "Google Search",
  description: "Access the latest information using Google Search. Useful for current events, news, and real-time information.",
  getTool: () => google.tools.googleSearch({}),
  enabled: false,
}`,
    },
    {
      type: "heading",
      level: 2,
      id: "use-cases",
      text: "Best Use Cases",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Finding current release notes, documentation updates, or breaking changes in libraries.",
        "Verifying latest syntax and API changes for rapidly evolving packages.",
        "Retrieving news and real-time facts not present in base model training cutoffs.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Native Grounding",
      text: "Responses generated with Google Search enabled often include native source references and verification citations provided directly by Gemini.",
    },
  ],
};
