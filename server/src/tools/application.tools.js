import { success } from "zod";
import { createExplorerTools } from "./explorer.tools.js";

export function createApplicationTools() {
    const explorerTools = createExplorerTools();

    return {

        async listDirectory(path = ".") {
            return explorerTools.listDirectory(path);
        },

        async listDirectoryTree(path = ".") {
            return explorerTools.listDirectoryTree(path);
        },

        async createDirectory(path){
            return explorerTools.createDirectory(path);
        },

        async searchFiles(query, path = ".") {
            return explorerTools.searchFiles(query, path);
        },

        async readFile(path) {
            return explorerTools.readFile(path);
        },

        async createDirectory(path) {
            return explorerTools.createDirectory(path);
        },

        async writeFile(path, content) {
            return explorerTools.writeFile(path, content);
        },

        async editFile(path, oldText, newText) {
            return explorerTools.editFile(path, oldText, newText);
        },

        async deleteFile(path) {
            return explorerTools.deleteFile(path);
        },

        async inspectProject() {
            const tree = await explorerTools.listDirectoryTree(".");

            let packageJson = null;

            try {
                const packageResult = await explorerTools.readFile("package.json");

                if (packageResult.success && packageResult.type === "text") {
                    packageJson = JSON.parse(packageResult.content);
                }
            } catch (error) {
                packageJson = null;
            }

            return {
                success: true,
                operation: "inspect_project",
                project: {
                    root: ".",
                    hasPackageJson: Boolean(packageJson),
                    packageName: packageJson?.name ?? null,
                    packageVersion: packageJson?.version ?? null,
                    dependencies: packageJson?.dependencies ?? {},
                    devDependencies: packageJson?.devDependencies ?? {},
                },
                tree,
                inspectedAt: new Date().toISOString()
            }
        }

        
    };
}