import { AIService } from "../cli/ai/google-service.js";
import { createExplorerTools } from "./explorer.tools.js";

async function test() {
    console.log("\n");
    console.log("========================================");
    console.log("        EXPLORER AI STEP-BY-STEP");
    console.log("========================================");
    console.log("\n");

    // ------------------------------------
    // STEP 1: Create AI service
    // ------------------------------------

    console.log("STEP 1: Creating AI Service");
    console.log("----------------------------------------");

    const ai = new AIService();

    console.log("AI Service created.");
    console.log("\n");


    // ------------------------------------
    // STEP 2: Create Explorer tools
    // ------------------------------------

    console.log("STEP 2: Creating Explorer Tools");
    console.log("----------------------------------------");

    const explorer = createExplorerTools();

    console.log("Available tools:");
    console.log("1. listDirectory()");
    console.log("2. searchFiles()");
    console.log("\n");


    // ------------------------------------
    // STEP 3: Create user message
    // ------------------------------------

    console.log("STEP 3: User Request");
    console.log("----------------------------------------");

    const messages = [
        {
            role: "user",
            content:
                "Show me the files and folder which is related to google",
        },
    ];

    console.log("USER:");
    console.log(messages[0].content);
    console.log("\n");


    // ------------------------------------
    // STEP 4: Send request to AI
    // ------------------------------------

    console.log("STEP 4: Sending Request to AI");
    console.log("----------------------------------------");

    console.log("Calling:");
    console.log("ai.generateExplorerAction(messages)");
    console.log("\n");

    const action =
        await ai.generateExplorerAction(messages);


    // ------------------------------------
    // STEP 5: AI structured response
    // ------------------------------------

    console.log("STEP 5: AI DECISION");
    console.log("----------------------------------------");

    console.log(
        JSON.stringify(action, null, 2)
    );

    console.log("\n");


    // ------------------------------------
    // STEP 6: Inspect AI decision
    // ------------------------------------

    console.log("STEP 6: Reading AI Decision");
    console.log("----------------------------------------");

    console.log(
        "action.action =",
        action.action
    );

    console.log(
        "action.path =",
        action.path
    );

    console.log(
        "action.query =",
        action.query
    );

    console.log(
        "action.reason =",
        action.reason
    );

    console.log("\n");


    // ------------------------------------
    // STEP 7: Decide which tool to execute
    // ------------------------------------

    console.log("STEP 7: Selecting Tool");
    console.log("----------------------------------------");

    let result;

    if (action.action === "search_files") {

        console.log(
            "AI selected: search_files"
        );

        console.log(
            "Calling explorer.searchFiles()"
        );

        console.log(
            "Arguments:"
        );

        console.log(
            "query =",
            action.query
        );

        console.log(
            "path =",
            action.path || "."
        );

        console.log("\n");

        result =
            await explorer.searchFiles(
                action.query,
                action.path || "."
            );
    }

    else if (
        action.action === "list_directory"
    ) {

        console.log(
            "AI selected: list_directory"
        );

        console.log(
            "Calling explorer.listDirectory()"
        );

        console.log(
            "Argument:"
        );

        console.log(
            "path =",
            action.path || "."
        );

        console.log("\n");

        result =
            await explorer.listDirectory(
                action.path || "."
            );
    }

    else {

        console.log(
            "AI selected unsupported action:"
        );

        console.log(
            action.action
        );

        throw new Error(
            `Unexpected action: ${action.action}`
        );
    }


    // ------------------------------------
    // STEP 8: Tool result
    // ------------------------------------

    console.log("STEP 8: TOOL RESULT");
    console.log("----------------------------------------");

    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

    console.log("\n");


    // ------------------------------------
    // STEP 9: Explain what happened
    // ------------------------------------

    console.log("STEP 9: FLOW SUMMARY");
    console.log("----------------------------------------");

    console.log(
        "User request"
    );

    console.log(
        "    ↓"
    );

    console.log(
        "generateExplorerAction()"
    );

    console.log(
        "    ↓"
    );

    console.log(
        `AI selected "${action.action}"`
    );

    console.log(
        "    ↓"
    );

    console.log(
        "Explorer tool executed"
    );

    console.log(
        "    ↓"
    );

    console.log(
        "Filesystem result returned"
    );

    console.log("\n");

    console.log("========================================");
    console.log("             TEST COMPLETED");
    console.log("========================================");
    console.log("\n");
}

test().catch((error) => {
    console.error("\n");
    console.error("========================================");
    console.error("       EXPLORER AI TEST FAILED");
    console.error("========================================");
    console.error("\n");

    console.error(error);

    process.exit(1);
});