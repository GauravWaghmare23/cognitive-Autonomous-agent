import { createApplicationTools } from "../../../tools/application.tools.js";

const tools = createApplicationTools();

console.log("\n========================================");
console.log("APPLICATION TOOLS TEST");
console.log("========================================");

/*
|--------------------------------------------------------------------------
| 1. LIST DIRECTORY
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 1. LIST DIRECTORY ==========");

const directoryResult = await tools.listDirectory(".");

console.log("Tool returned:");
console.dir(directoryResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 2. LIST DIRECTORY TREE
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 2. DIRECTORY TREE ==========");

const treeResult = await tools.listDirectoryTree(".");

console.log("Tool returned:");
console.dir(treeResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 3. SEARCH FILES
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 3. SEARCH FILES ==========");

const searchResult = await tools.searchFiles("package");

console.log("Tool returned:");
console.dir(searchResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 4. READ PACKAGE.JSON
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 4. READ FILE ==========");

const readResult = await tools.readFile("package.json");

console.log("Tool returned:");
console.dir(readResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 5. INSPECT PROJECT
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 5. INSPECT PROJECT ==========");

const inspectResult = await tools.inspectProject();

console.log("Tool returned:");
console.dir(inspectResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 6. CREATE DIRECTORY
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 6. CREATE DIRECTORY ==========");

const createDirectoryResult = await tools.createDirectory(
  "agent-test/components",
);

console.log("Tool returned:");
console.dir(createDirectoryResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 7. WRITE FILE
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 7. WRITE FILE ==========");

const writeResult = await tools.writeFile(
  "agent-test/components/Button.jsx",
  `export default function Button() {
  return <button>Click me</button>;
}
`,
);

console.log("Tool returned:");
console.dir(writeResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 8. READ THE FILE WE JUST CREATED
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 8. READ CREATED FILE ==========");

const createdFileResult = await tools.readFile(
  "agent-test/components/Button.jsx",
);

console.log("Tool returned:");
console.dir(createdFileResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 9. EDIT FILE
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 9. EDIT FILE ==========");

const editResult = await tools.editFile(
  "agent-test/components/Button.jsx",

  "Click me",

  "Click Me!",
);

console.log("Tool returned:");
console.dir(editResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 10. READ AFTER EDIT
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 10. READ AFTER EDIT ==========");

const editedFileResult = await tools.readFile(
  "agent-test/components/Button.jsx",
);

console.log("Tool returned:");
console.dir(editedFileResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 11. DELETE FILE
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 11. DELETE FILE ==========");

const deleteResult = await tools.deleteFile("agent-test/components/Button.jsx");

console.log("Tool returned:");
console.dir(deleteResult, { depth: null });

/*
|--------------------------------------------------------------------------
| 12. VERIFY DELETE
|--------------------------------------------------------------------------
*/

console.log("\n\n========== 12. VERIFY DELETE ==========");

try {
  await tools.readFile("agent-test/components/Button.jsx");

  console.log("ERROR: File still exists!");
} catch (error) {
  console.log("Expected error:", error.message);
}

console.log("\n\n========================================");
console.log("TEST COMPLETE");
console.log("========================================");
