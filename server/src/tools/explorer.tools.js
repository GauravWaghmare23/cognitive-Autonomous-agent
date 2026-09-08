import { promises as fs } from "fs";
import path from "path";
import { explorerConfig } from "../config/explorer.config.js";


function resolveWorkspacePath(targetPath = ".") {
    const workspaceRoot = path.resolve(
        explorerConfig.workspace.root
    );

    const resolvedPath = path.resolve(
        workspaceRoot,
        targetPath
    );

    const relativePath = path.relative(
        workspaceRoot,
        resolvedPath
    );

    if (
        relativePath.startsWith("..") ||
        path.isAbsolute(relativePath)
    ) {
        throw new Error(
            "Access denied: path is outside the workspace."
        );
    }

    return resolvedPath;
}


function isIgnoredDirectory(name) {
    return explorerConfig.workspace.ignoredDirectories
        .includes(name);
}


function isIgnoredFile(name) {
    return explorerConfig.workspace.ignoredFiles
        .includes(name);
}


export function createExplorerTools() {
    return {
        async listDirectory(targetPath = ".") {
            const directory = resolveWorkspacePath(targetPath);
            const entries = await fs.readdir(directory, { withFileTypes: true });

            const results = [];

            for (const entry of entries) {
                if (entry.isDirectory() && isIgnoredDirectory(entry.name)) {
                    continue;
                }
                if (entry.isFile() && isIgnoredFile(entry.name)) {
                    continue;
                }

                results.push({
                    name: entry.name,
                    type: entry.isDirectory() ? "directory" : "file",
                });
            }

            results.sort((a, b) => {

                if (
                    a.type !== b.type
                ) {
                    return a.type === "directory"
                        ? -1
                        : 1;
                }

                return a.name.localeCompare(
                    b.name
                );
            });

            return {
                path: targetPath,
                entries: results,
            };

        },

        async searchFiles(query, targetPath = ".") {
            if (!query || !query.trim()) {
                throw new Error(
                    "Search query cannot be empty."
                );
            }

            const directory =
                resolveWorkspacePath(targetPath);

            const results = [];

            async function searchDirectory(currentDirectory) {
                if (
                    results.length >=
                    explorerConfig.limits.maxSearchResults
                ) {
                    return;
                }

                const entries =
                    await fs.readdir(
                        currentDirectory,
                        {
                            withFileTypes: true,
                        }
                    );

                for (const entry of entries) {
                    if (
                        results.length >=
                        explorerConfig.limits.maxSearchResults
                    ) {
                        return;
                    }

                    if (
                        entry.isDirectory() &&
                        isIgnoredDirectory(entry.name)
                    ) {
                        continue;
                    }

                    if (
                        entry.isFile() &&
                        isIgnoredFile(entry.name)
                    ) {
                        continue;
                    }

                    const entryPath =
                        path.join(
                            currentDirectory,
                            entry.name
                        );

                    if (entry.isDirectory()) {
                        await searchDirectory(entryPath);
                        continue;
                    }

                    if (
                        entry.name
                            .toLowerCase()
                            .includes(
                                query
                                    .trim()
                                    .toLowerCase()
                            )
                    ) {
                        results.push({
                            name: entry.name,
                            path: path.relative(
                                explorerConfig.workspace.root,
                                entryPath
                            ),
                            type: "file",
                        });
                    }
                }
            }

            await searchDirectory(directory);

            return {
                query: query.trim(),
                path: targetPath,
                results,
                total: results.length,
            };
        },

        async readFile(targetPath) {
            if (!targetPath || !targetPath.trim()) {
                throw new Error("File path cannot be empty.");
            }

            const filePath = resolveWorkspacePath(
                targetPath.trim()
            );

            const fileName = path.basename(filePath);

            if (isIgnoredFile(fileName)) {
                throw new Error(
                    "Access denied: file is ignored."
                );
            }

            const stats = await fs.stat(filePath);

            if (!stats.isFile()) {
                throw new Error(
                    "The specified path is not a file."
                );
            }

            if (
                stats.size >
                explorerConfig.limits.maxFileSize
            ) {
                throw new Error(
                    `File is too large. Maximum allowed size is ${explorerConfig.limits.maxFileSize} bytes.`
                );
            }

            const content = await fs.readFile(
                filePath,
                "utf-8"
            );

            return {
                name: fileName,
                path: path.relative(
                    explorerConfig.workspace.root,
                    filePath
                ),
                type: "file",
                size: stats.size,
                content,
            };
        },

    }
}