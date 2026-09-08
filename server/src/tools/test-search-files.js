import { createExplorerTools } from "./explorer.tools.js";

async function test() {
    const explorer = createExplorerTools();

    console.log("\n==============================");
    console.log("   SEARCH FILES TOOL TEST");
    console.log("==============================\n");

    // Test 1: Search from workspace root
    console.log("Test 1: Search for 'google' from workspace root\n");

    const result1 = await explorer.searchFiles("google");

    console.log(JSON.stringify(result1, null, 2));

    // Test 2: Search from src directory
    console.log("\n--------------------------------");
    console.log("Test 2: Search for 'config' inside src\n");

    const result2 = await explorer.searchFiles(
        "config",
        "src"
    );

    console.log(JSON.stringify(result2, null, 2));

    // Test 3: Empty query should fail
    console.log("\n--------------------------------");
    console.log("Test 3: Empty search query\n");

    try {
        await explorer.searchFiles("");
    } catch (error) {
        console.log("Expected error:");
        console.log(error.message);
    }

    console.log("\n==============================");
    console.log("   ALL TESTS COMPLETED");
    console.log("==============================\n");
}

test().catch((error) => {
    console.error("\nSearch files test failed:");
    console.error(error);
    process.exit(1);
});