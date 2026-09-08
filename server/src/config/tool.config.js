import { google } from "@ai-sdk/google";
import chalk from "chalk";


export const availableTools = [
    {
        id: "google_search",
        name: "Google Search",
        description: "Access the latest information using Google Search. Useful for current events, news, and real-time information.",
        getTool: () => google.tools.googleSearch({}),
        enabled: false,
    },
    {
        id: "code_execution",
        name: "Code Execution",
        description: "Generate and execute Python code to perform calculations, solve problems, or provide accurate information.",
        getTool: () => google.tools.codeExecution({}),
        enabled: false,
    },
    {
        id: "url_context",
        name: "URL Context",
        description: "Provide specific URLs that you want the model to analyze directly from the prompt. Supports up to 20 URLs per request.",
        getTool: () => google.tools.urlContext({}),
        enabled: false,
    },
];

export function getEnabledTools() {

    const tools = {};

    try {

        for (const toolConfig of availableTools) {
            if (toolConfig.enabled) {
                tools[toolConfig.id] = toolConfig.getTool()
            }
        }

        return Object.keys(tools).length > 0 ? tools : undefined;

    } catch (error) {
        console.log();
        console.log(
            chalk.red("  ✕ Failed to initialize tools"),
            chalk.dim(error.message)
        );

        console.log(
            chalk.dim(
                "    Make sure @ai-sdk/google is up to date: npm install @ai-sdk/google@latest"
            )
        );
        console.log();

        return undefined;
    }
}

export function toogleTool(toolId) {

    const tool = availableTools.find(t => t.id === toolId);
    if (tool) {
        tool.enabled = !tool.enabled;
        return tool.enabled;
    }

    return false;
}


export function enableTools(toolIds) {
    availableTools.forEach((tool) => {
        tool.enabled = toolIds.includes(tool.id);
    });
}


export function getEnabledToolNames() {
    return availableTools
        .filter((t) => t.enabled)
        .map((t) => t.name);
}

export function resetTools() {
    availableTools.forEach((tool) => {
        tool.enabled = false;
    });
}