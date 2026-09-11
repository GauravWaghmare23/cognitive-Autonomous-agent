import {
  createApplicationState,
} from "../application.state.js";

import {
  ApplicationRuntime,
} from "../application.runtime.js";


/*
|--------------------------------------------------------------------------
| CREATE STATE
|--------------------------------------------------------------------------
*/

const state = createApplicationState();


/*
|--------------------------------------------------------------------------
| CREATE RUNTIME
|--------------------------------------------------------------------------
*/

const runtime = new ApplicationRuntime(state);


console.log("\n========================================");
console.log("APPLICATION RUNTIME TEST");
console.log("========================================");


/*
|--------------------------------------------------------------------------
| 1. INSPECT PROJECT
|--------------------------------------------------------------------------
*/

console.log("\n========== 1. INSPECT PROJECT ==========");

const inspectAction = {
  action: "inspect_project",

  path: null,
  query: null,
  content: null,
  oldText: null,
  newText: null,
  command: null,
  packages: null,
  reason:
    "Understand the existing project.",
  response: null,
};

const inspectResult =
  await runtime.executeAction(
    inspectAction,
  );

console.dir(
  inspectResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 2. LIST DIRECTORY
|--------------------------------------------------------------------------
*/

console.log("\n========== 2. LIST DIRECTORY ==========");

const listAction = {
  action: "list_directory",

  path: "src",

  query: null,
  content: null,
  oldText: null,
  newText: null,
  command: null,
  packages: null,
  reason:
    "Inspect the source directory.",
  response: null,
};

const listResult =
  await runtime.executeAction(
    listAction,
  );

console.dir(
  listResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 3. LIST DIRECTORY TREE
|--------------------------------------------------------------------------
*/

console.log(
  "\n========== 3. DIRECTORY TREE ==========",
);

const treeAction = {
  action: "list_directory_tree",

  path: "src",

  query: null,
  content: null,
  oldText: null,
  newText: null,
  command: null,
  packages: null,
  reason:
    "Understand the source project structure.",
  response: null,
};

const treeResult =
  await runtime.executeAction(
    treeAction,
  );

console.dir(
  treeResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 4. SEARCH FILES
|--------------------------------------------------------------------------
*/

console.log("\n========== 4. SEARCH FILES ==========");

const searchAction = {
  action: "search_files",

  path: ".",

  query: "application",

  content: null,
  oldText: null,
  newText: null,
  command: null,
  packages: null,
  reason:
    "Find application-related files.",
  response: null,
};

const searchResult =
  await runtime.executeAction(
    searchAction,
  );

console.dir(
  searchResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 5. READ FILE
|--------------------------------------------------------------------------
*/

console.log("\n========== 5. READ FILE ==========");

const readAction = {
  action: "read_file",

  path: "package.json",

  query: null,
  content: null,
  oldText: null,
  newText: null,
  command: null,
  packages: null,
  reason:
    "Understand project dependencies.",
  response: null,
};

const readResult =
  await runtime.executeAction(
    readAction,
  );

console.dir(
  readResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 6. CREATE DIRECTORY
|--------------------------------------------------------------------------
*/

console.log(
  "\n========== 6. CREATE DIRECTORY ==========",
);

const createDirectoryAction = {
  action: "create_directory",

  path: "runtime-test/components",

  query: null,
  content: null,
  oldText: null,
  newText: null,
  command: null,
  packages: null,
  reason:
    "Create a temporary components directory.",
  response: null,
};

const createDirectoryResult =
  await runtime.executeAction(
    createDirectoryAction,
  );

console.dir(
  createDirectoryResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 7. WRITE FILE
|--------------------------------------------------------------------------
*/

console.log("\n========== 7. WRITE FILE ==========");

const writeAction = {
  action: "write_file",

  path:
    "runtime-test/components/Button.jsx",

  query: null,

  content: `export default function Button() {
  return <button>Click me</button>;
}
`,

  oldText: null,
  newText: null,
  command: null,
  packages: null,

  reason:
    "Create a temporary Button component.",

  response: null,
};

const writeResult =
  await runtime.executeAction(
    writeAction,
  );

console.dir(
  writeResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 8. READ CREATED FILE
|--------------------------------------------------------------------------
*/

console.log(
  "\n========== 8. READ CREATED FILE ==========",
);

const readCreatedAction = {
  action: "read_file",

  path:
    "runtime-test/components/Button.jsx",

  query: null,
  content: null,
  oldText: null,
  newText: null,
  command: null,
  packages: null,

  reason:
    "Verify the Button component.",
  response: null,
};

const readCreatedResult =
  await runtime.executeAction(
    readCreatedAction,
  );

console.dir(
  readCreatedResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 9. EDIT FILE
|--------------------------------------------------------------------------
*/

console.log(
  "\n========== 9. EDIT FILE ==========",
);

const editAction = {
  action: "edit_file",

  path:
    "runtime-test/components/Button.jsx",

  query: null,
  content: null,

  oldText: "Click me",

  newText: "Click Me!",

  command: null,
  packages: null,

  reason:
    "Change the button text.",

  response: null,
};

const editResult =
  await runtime.executeAction(
    editAction,
  );

console.dir(
  editResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 10. READ AFTER EDIT
|--------------------------------------------------------------------------
*/

console.log(
  "\n========== 10. READ AFTER EDIT ==========",
);

const readAfterEditAction = {
  action: "read_file",

  path:
    "runtime-test/components/Button.jsx",

  query: null,
  content: null,
  oldText: null,
  newText: null,
  command: null,
  packages: null,

  reason:
    "Verify the edit.",
  response: null,
};

const readAfterEditResult =
  await runtime.executeAction(
    readAfterEditAction,
  );

console.dir(
  readAfterEditResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 11. DELETE FILE
|--------------------------------------------------------------------------
*/

console.log(
  "\n========== 11. DELETE FILE ==========",
);

const deleteAction = {
  action: "delete_file",

  path:
    "runtime-test/components/Button.jsx",

  query: null,
  content: null,
  oldText: null,
  newText: null,
  command: null,
  packages: null,

  reason:
    "Remove the temporary test file.",
  response: null,
};

const deleteResult =
  await runtime.executeAction(
    deleteAction,
  );

console.dir(
  deleteResult,
  { depth: null },
);


/*
|--------------------------------------------------------------------------
| 12. VERIFY DELETE
|--------------------------------------------------------------------------
*/

console.log(
  "\n========== 12. VERIFY DELETE ==========",
);

try {
  await runtime.executeAction({
    action: "read_file",

    path:
      "runtime-test/components/Button.jsx",

    query: null,
    content: null,
    oldText: null,
    newText: null,
    command: null,
    packages: null,
    reason:
      "Verify that the file no longer exists.",
    response: null,
  });

  console.log(
    "ERROR: File still exists.",
  );
} catch (error) {
  console.log(
    "Expected error:",
    error.message,
  );
}


console.log("\n========================================");
console.log("RUNTIME TEST COMPLETE");
console.log("========================================");