export const applicationConfig = {

    maxSteps: 30,
    maxFilesPerOperation: 50,
    maxFileSize: 1024 * 1024,
    maxRetries: 3,

    workspace: {
        root: process.cwd(),
        ignoredDirectories: [
            "node_modules",
            ".git",
            ".next",
            "dist",
            "build",
            "coverage",
        ],

        ignoredFiles: [".env", ".env.local", ".env.production", ".env.development"],
    },

    allowedCommands: ["npm", "npx", "node", "git", "python", "pip"],

    process: {
        startupTimeout: 30000,
        shutdownTimeout: 10000,
        maxOutputSize: 100000,
    },
};
