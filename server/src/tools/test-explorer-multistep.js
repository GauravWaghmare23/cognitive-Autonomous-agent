import { AIService } from "../cli/ai/google-service.js";
import { createExplorerTools } from "./explorer.tools.js";

async function test() {
    console.log("\n==============================");
    console.log("   MULTI-STEP EXPLORER TEST");
    console.log("==============================\n");

    const ai = new AIService();
    const explorer = createExplorerTools();

    const messages = [
        {
            role: "user",
            content:
                "Read the Google configuration file and tell me what model is being used.",
        },
    ];

    const maxSteps = 10;

    for (let step = 1; step <= maxSteps; step++) {
        console.log(`\n========== STEP ${step} ==========\n`);

        console.log("Asking Gemini what to do...\n");

        const action =
            await ai.generateExplorerAction(messages);

        console.log("AI ACTION:");
        console.log(
            JSON.stringify(action, null, 2)
        );

        // If AI says finish, stop the agent loop
        if (action.action === "finish") {
            console.log("\nAI decided to finish.\n");

            messages.push({
                role: "assistant",
                content: JSON.stringify(action),
            });

            break;
        }

        let result;

        // Execute selected tool
        if (action.action === "list_directory") {
            result = await explorer.listDirectory(
                action.path || "."
            );
        }

        else if (action.action === "search_files") {
            result = await explorer.searchFiles(
                action.query,
                action.path || "."
            );
        }

        else if (action.action === "read_file") {
            result = await explorer.readFile(
                action.path
            );
        }

        else {
            throw new Error(
                `Tool not implemented yet: ${action.action}`
            );
        }

        console.log("\nTOOL RESULT:");
        console.log(
            JSON.stringify(result, null, 2)
        );

        // Give Gemini its own previous action
        messages.push({
            role: "assistant",
            content: JSON.stringify(action),
        });

        // Give Gemini the tool result
        messages.push({
            role: "user",
            content: `
Tool result for action "${action.action}":

${JSON.stringify(result, null, 2)}

Based on this result, decide what to do next.
If you have enough information to answer the user,
use the "finish" action.
            `,
        });
    }

    console.log("\n==============================");
    console.log("   MULTI-STEP TEST COMPLETED");
    console.log("==============================\n");
}

test().catch((error) => {
    console.error("\nMulti-step Explorer test failed:");
    console.error(error);
    process.exit(1);
});