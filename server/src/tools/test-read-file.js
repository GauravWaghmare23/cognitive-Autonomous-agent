import { createExplorerTools } from "./explorer.tools.js";

async function test() {
    const explorer = createExplorerTools();

    console.log("\n==============================");
    console.log("   READ FILE TOOL TEST");
    console.log("==============================\n");

    console.log(
        "Test 1: Read google.config.js\n"
    );

    const result1 = await explorer.readFile(
        "src/config/google.config.js"
    );

    console.log(JSON.stringify(result1, null, 2));

    console.log("\n--------------------------------");

    console.log(
        "Test 2: Try to read an ignored file\n"
    );

    try {
        await explorer.readFile(".env");
    } catch (error) {
        console.log("Expected error:");
        console.log(error.message);
    }

    console.log("\n--------------------------------");

    console.log(
        "Test 3: Try to read a directory\n"
    );

    try {
        await explorer.readFile("src/config");
    } catch (error) {
        console.log("Expected error:");
        console.log(error.message);
    }

    console.log("\n--------------------------------");

    console.log(
        "Test 4: Empty file path\n"
    );

    try {
        await explorer.readFile("");
    } catch (error) {
        console.log("Expected error:");
        console.log(error.message);
    }

    console.log("\n==============================");
    console.log("   ALL TESTS COMPLETED");
    console.log("==============================\n");
}

test().catch((error) => {
    console.error("\nRead file test failed:");
    console.error(error);
    process.exit(1);
});