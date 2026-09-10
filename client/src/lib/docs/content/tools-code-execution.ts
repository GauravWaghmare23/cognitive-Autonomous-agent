import { DocPage } from "../types";

export const toolsCodeExecutionPage: DocPage = {
  slug: "tools/code-execution",
  group: "tools",
  title: "Code Execution",
  description: "Native Gemini tool for executing sandboxed Python code to solve computational tasks.",
  blocks: [
    {
      type: "paragraph",
      text: "The `code_execution` tool integrates Google Gemini's built-in Python execution environment directly into your interactive terminal sessions.",
    },
    {
      type: "heading",
      level: 2,
      id: "implementation",
      text: "Implementation Details",
    },
    {
      type: "paragraph",
      text: "Registered natively via `@ai-sdk/google`:",
    },
    {
      type: "code",
      lang: "javascript",
      label: "tool.config.js",
      code: `{
  id: "code_execution",
  name: "Code Execution",
  description: "Generate and execute Python code to perform calculations, solve problems, or provide accurate information.",
  getTool: () => google.tools.codeExecution({}),
  enabled: false,
}`,
    },
    {
      type: "heading",
      level: 2,
      id: "how-it-operates",
      text: "Execution Flow",
    },
    {
      type: "flow",
      steps: [
        "Prompt asks for complex calculation, data analysis, or algorithmic verification",
        "Model writes Python script in sandboxed environment",
        "Script output and return values are evaluated",
        "Result combined into final terminal response with full code visibility",
      ],
      caption: "Python Code Execution Flow",
    },
    {
      type: "callout",
      tone: "success",
      title: "Eliminates Math Hallucinations",
      text: "Instead of guessing arithmetic or string parsing results, the model computes answers through real Python runtime execution.",
    },
  ],
};
