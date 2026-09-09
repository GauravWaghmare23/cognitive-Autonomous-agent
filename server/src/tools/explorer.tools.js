import { promises as fs } from "fs";
import path from "path";
import { explorerConfig } from "../config/explorer.config.js";

/**
 * Resolve a path safely inside the configured workspace.
 */
function resolveWorkspacePath(targetPath = ".") {
  const workspaceRoot = path.resolve(explorerConfig.workspace.root);

  const resolvedPath = path.resolve(workspaceRoot, targetPath);

  const relativePath = path.relative(workspaceRoot, resolvedPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Access denied: path is outside the workspace.");
  }

  return resolvedPath;
}

/**
 * Check whether a directory should be ignored.
 */
function isIgnoredDirectory(name) {
  return explorerConfig.workspace.ignoredDirectories.includes(name);
}

/**
 * Check whether a file should be ignored.
 */
function isIgnoredFile(name) {
  return explorerConfig.workspace.ignoredFiles.includes(name);
}

/**
 * Sort filesystem Dirent objects.
 *
 * Directories come first, followed by files.
 * Items inside each group are sorted alphabetically.
 */
function sortDirents(entries) {
  return entries.sort((a, b) => {
    const aType = a.isDirectory() ? "directory" : "file";

    const bType = b.isDirectory() ? "directory" : "file";

    if (aType !== bType) {
      return aType === "directory" ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });
}

/**
 * Sort Explorer result objects.
 */
function sortResults(entries) {
  return entries.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });
}

export function createExplorerTools() {
  return {
    /**
     * List the immediate contents of a directory.
     */
    async listDirectory(targetPath = ".") {
      const directory = resolveWorkspacePath(targetPath);

      const entries = await fs.readdir(directory, {
        withFileTypes: true,
      });

      sortDirents(entries);

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

      sortResults(results);

      return {
        path: targetPath,

        entries: results,

        total: results.length,
      };
    },

    /**
     * Recursively list a directory tree.
     *
     * This is useful when the user asks:
     *
     * "Show me all files and folders."
     *
     * It does NOT read file contents.
     */
    async listDirectoryTree(targetPath = ".") {
      const rootDirectory = resolveWorkspacePath(targetPath);

      const maxDepth = explorerConfig.limits.maxTreeDepth;

      const maxEntries = explorerConfig.limits.maxTreeEntries;

      let totalEntries = 0;

      let truncated = false;

      async function buildTree(currentDirectory, relativePath, depth) {
        /**
         * Stop if maximum depth is reached.
         */
        if (depth > maxDepth) {
          truncated = true;

          return {
            name: path.basename(currentDirectory),

            type: "directory",

            path: relativePath,

            children: [],

            truncated: true,
          };
        }

        /**
         * Stop if maximum number of entries
         * has been reached.
         */
        if (totalEntries >= maxEntries) {
          truncated = true;

          return null;
        }

        const entries = await fs.readdir(currentDirectory, {
          withFileTypes: true,
        });

        /**
         * Remove ignored files/directories.
         */
        const filteredEntries = entries.filter((entry) => {
          if (entry.isDirectory() && isIgnoredDirectory(entry.name)) {
            return false;
          }

          if (entry.isFile() && isIgnoredFile(entry.name)) {
            return false;
          }

          return true;
        });

        /**
         * Sort actual Dirent objects.
         */
        sortDirents(filteredEntries);

        const children = [];

        for (const entry of filteredEntries) {
          /**
           * Check global entry limit.
           */
          if (totalEntries >= maxEntries) {
            truncated = true;

            break;
          }

          totalEntries++;

          const entryPath = path.join(currentDirectory, entry.name);

          const entryRelativePath = path.join(relativePath, entry.name);

          /**
           * Directory
           */
          if (entry.isDirectory()) {
            const directoryNode = await buildTree(
              entryPath,
              entryRelativePath,
              depth + 1,
            );

            if (directoryNode) {
              children.push(directoryNode);
            }

            continue;
          }

          /**
           * File
           */
          children.push({
            name: entry.name,

            type: "file",

            path: entryRelativePath,
          });
        }

        return {
          name: relativePath === "." ? "." : path.basename(currentDirectory),

          type: "directory",

          path: relativePath,

          children,

          ...(depth >= maxDepth
            ? {
                truncated: true,
              }
            : {}),
        };
      }

      const tree = await buildTree(rootDirectory, ".", 0);

      return {
        path: targetPath,

        tree,

        totalEntries,

        maxDepth,

        maxEntries,

        truncated,
      };
    },

    /**
     * Search for files by filename.
     *
     * This searches FILE NAMES only.
     * It does not search file contents.
     */
    async searchFiles(query, targetPath = ".") {
      if (!query || !query.trim()) {
        throw new Error("Search query cannot be empty.");
      }

      const normalizedQuery = query.trim().toLowerCase();

      const directory = resolveWorkspacePath(targetPath);

      const results = [];

      async function searchDirectory(currentDirectory) {
        /**
         * Stop when result limit is reached.
         */
        if (results.length >= explorerConfig.limits.maxSearchResults) {
          return;
        }

        const entries = await fs.readdir(currentDirectory, {
          withFileTypes: true,
        });

        /**
         * Sort actual Dirent objects.
         */
        sortDirents(entries);

        for (const entry of entries) {
          /**
           * Stop when result limit
           * is reached.
           */
          if (results.length >= explorerConfig.limits.maxSearchResults) {
            return;
          }

          /**
           * Ignore directories.
           */
          if (entry.isDirectory() && isIgnoredDirectory(entry.name)) {
            continue;
          }

          /**
           * Ignore files.
           */
          if (entry.isFile() && isIgnoredFile(entry.name)) {
            continue;
          }

          const entryPath = path.join(currentDirectory, entry.name);

          /**
           * Recursively search directories.
           */
          if (entry.isDirectory()) {
            await searchDirectory(entryPath);

            continue;
          }

          /**
           * Match filename.
           */
          if (entry.name.toLowerCase().includes(normalizedQuery)) {
            results.push({
              name: entry.name,

              path: path.relative(explorerConfig.workspace.root, entryPath),

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

    /**
     * Read the contents of a file.
     */
    async readFile(targetPath) {
      if (!targetPath || !targetPath.trim()) {
        throw new Error("File path cannot be empty.");
      }

      const filePath = resolveWorkspacePath(targetPath.trim());

      const fileName = path.basename(filePath);

      /**
       * Never allow ignored files.
       */
      if (isIgnoredFile(fileName)) {
        throw new Error("Access denied: file is ignored.");
      }

      const stats = await fs.stat(filePath);

      /**
       * Make sure the target
       * is actually a file.
       */
      if (!stats.isFile()) {
        throw new Error("The specified path is not a file.");
      }

      /**
       * Protect the agent from
       * enormous files.
       */
      if (stats.size > explorerConfig.limits.maxFileSize) {
        throw new Error(
          `File is too large. Maximum allowed size is ${explorerConfig.limits.maxFileSize} bytes.`,
        );
      }

      const content = await fs.readFile(filePath, "utf-8");

      return {
        name: fileName,

        path: path.relative(explorerConfig.workspace.root, filePath),

        type: "file",

        size: stats.size,

        content,
      };
    },
  };
}
