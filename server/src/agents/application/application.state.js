export function createApplicationState() {
    return {
        application: {
            name: null,
            type: null,
            root: null,
        },

        stack: {
            frontend: null,
            backend: null,
            database: null,
            orm: null,
            language: null,
            framework: null,
        },

        status: "idle",

        process: {
            running: false,
            pid: null,
            command: null,
            port: null,
        },

        files: {
            created: [],
            modified: [],
            deleted: [],
        },

        dependencies: {
            installed: false,
            packages: [],
        },

        validation: {
            build: "unknown",
            tests: "unknown",
            lastError: null,
        },

        tasks: {
            currentId: null,
            history: [],
        },

        actions: {
            last: null,
            history: [],
        },
    };
}

function createId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createTask(state, description) {
    const task = {
        id: createId("task"),
        description,
        status: "in_progress",
        createdAt: new Date().toISOString(),
        completedAt: null,
    };

    state.tasks.currentId = task.id;
    state.tasks.history.push(task);
    return task;
}

export function completeTask(state,taskId){
    const task = state.tasks.history.find((task) => task.id === taskId);
    if (!task) {
        return null;
    }
    task.status = "completed";
    task.completedAt = new Date().toISOString();

    if (state.tasks.currentId === taskId) {
        state.tasks.currentId = null;
    }
    return task;
}

export function recordAction(state, action){
    const recordedAction = {
        id:createId("action"),
        ...action,
        createdAt: new Date().toISOString(),
    }
    state.actions.last = recordedAction;
    state.actions.history.push(recordedAction);
    return recordedAction;
}

export function updateStatus(state, status){
    state.status = status;
    return state.status;
}