import { AIService } from "../cli/ai/google-service.js";
import { createExplorerTools } from "./explorer.tools.js";

async function test() {
    console.log("\n==============================");
    console.log("   READ FILE AI TEST");
    console.log("==============================\n");

    // Step 1: Create AI service
    console.log("Step 1: Creating AI service...\n");

    const ai = new AIService();

    // Step 2: Create Explorer tools
    console.log("Step 2: Creating Explorer tools...\n");

    const explorer = createExplorerTools();

    // Step 3: User request
    const messages = [
        {
            role: "user",
            content:
                "Read the Google configuration file and tell me what model is being used.",
        },
    ];

    console.log("Step 3: User request:");
    console.log(messages[0].content);

    // Step 4: Ask Gemini to decide what action to take
    console.log(
        "\nStep 4: Asking Gemini to choose an action...\n"
    );

    const action =
        await ai.generateExplorerAction(messages);

    // Step 5: Show Gemini's decision
    console.log("Step 5: AI ACTION:");
    console.log(
        JSON.stringify(action, null, 2)
    );

    // Step 6: Execute the action
    console.log("\nStep 6: Executing action...\n");

    let result;

    if (action.action === "search_files") {
        result = await explorer.searchFiles(
            action.query,
            action.path || "."
        );
    } else if (action.action === "list_directory") {
        result = await explorer.listDirectory(
            action.path || "."
        );
    } else if (action.action === "read_file") {
        result = await explorer.readFile(
            action.path
        );
    } else {
        throw new Error(
            `Unexpected action: ${action.action}`
        );
    }

    // Step 7: Show tool result
    console.log("Step 7: TOOL RESULT:");
    console.log(
        JSON.stringify(result, null, 2)
    );

    console.log("\n==============================");
    console.log("   TEST COMPLETED");
    console.log("==============================\n");
}

test().catch((error) => {
    console.error("\nRead file AI test failed:");
    console.error(error);
    process.exit(1);
});