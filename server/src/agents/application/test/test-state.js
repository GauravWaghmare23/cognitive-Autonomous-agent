import { createApplicationState, createTask, updateStatus, recordAction, completeTask } from "../application.state.js";

const state = createApplicationState();

console.log("\n1. INITIAL STATE");
console.dir(state, { depth: null });


console.log("\n2. CREATE TASK");

const task = createTask(

  state,
  "Build a task management application"
);

console.dir(task, { depth: null });

console.log("Current Task ID:");
console.log(state.tasks.currentId);

console.log("Task History:");
console.dir(state.tasks.history, { depth: null });


console.log("\n3. UPDATE STATUS");

updateStatus(state, "planning");

console.log("Current Status:");
console.log(state.status);


console.log("\n4. RECORD ACTION");

const action = recordAction(state, {
  type: "inspect_project",
  path: null,
  status: "completed",
  reason: "Understand the existing project structure",
});

console.log("Recorded Action:");
console.dir(action, { depth: null });

console.log("Last Action:");
console.dir(state.actions.last, { depth: null });

console.log("Action History:");
console.dir(state.actions.history, { depth: null });


console.log("\n5. COMPLETE TASK");

const completedTask = completeTask(
  state,
  task.id
);

console.log("Completed Task:");
console.dir(completedTask, { depth: null });

console.log("Current Task ID:");
console.log(state.tasks.currentId);


console.log("\n6. FINAL STATE");

console.dir(state, { depth: null });