import { promises as fs, stat } from "node:fs";
import path from "node:path";

import { explorerConfig } from "../config/explorer.config.js";

import {
  getFileType,
  readTextFile,
  readPdfFile,
  readDocxFile,
  readImageFile,
} from "./file-readers.js";
import { success } from "zod";

function resolveWorkspacePath(targetPath = ".") {
  const workspaceRoot = path.resolve(explorerConfig.workspace.root);
  const resolvedPath = path.resolve(workspaceRoot, targetPath);
  const relativePath = path.relative(workspaceRoot, resolvedPath);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error("Access denied: path is outside the workspace.");
  }

  return resolvedPath;
}

function isIgnoredDirectory(name) {
  return explorerConfig.workspace.ignoredDirectories.includes(name);
}

function isIgnoredFile(name) {
  return explorerConfig.workspace.ignoredFiles.includes(name);
}

function sortDirents(entries) {
  return entries.sort((a, b) => {
    const aType = a.isDirectory() ? "directory" : "file";

    const bType = b.isDirectory() ? "directory" : "file";

    /*
     * Directories first.
     */

    if (aType !== bType) {
      return aType === "directory" ? -1 : 1;
    }

    return a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
    });
  });
}

function sortResults(entries) {
  return entries.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }

    return a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
    });
  });
}

function getRelativePath(filePath) {
  const relativePath = path.relative(explorerConfig.workspace.root, filePath);
  return relativePath || ".";
}

function getMaxWriteSize() {
  return (
    explorerConfig.limits.maxWriteSize ?? explorerConfig.limits.maxFileSize
  );
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) {
    return "unknown size";
  }

  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isEditableFileType(fileType) {
  return fileType === "text";
}

function assertEditableFile(filePath) {
  const fileType = getFileType(filePath);

  if (!isEditableFileType(fileType)) {
    throw new Error(
      `This file type cannot currently be edited. ` +
      `Explorer only supports editing text/source files.`,
    );
  }

  return fileType;
}

export function createExplorerTools() {
  return {

    async listDirectory(targetPath = ".") {
      const directory = resolveWorkspacePath(targetPath);

      const stats = await fs.stat(directory);

      if (!stats.isDirectory()) {
        throw new Error("The specified path is not a directory.");
      }

      const entries = await fs.readdir(directory, {
        withFileTypes: true,
      });

      sortDirents(entries);

      const results = [];

      for (const entry of entries) {
        /*
         * Ignore configured directories.
         */

        if (entry.isDirectory() && isIgnoredDirectory(entry.name)) {
          continue;
        }

        /*
         * Ignore configured files.
         */

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
        success: true,

        operation: "list_directory",

        path: getRelativePath(directory),

        entries: results,

        total: results.length,
      };
    },

    async listDirectoryTree(targetPath = ".") {
      const rootDirectory = resolveWorkspacePath(targetPath);

      const rootStats = await fs.stat(rootDirectory);

      if (!rootStats.isDirectory()) {
        throw new Error("The specified path is not a directory.");
      }

      const maxDepth = explorerConfig.limits.maxTreeDepth;

      const maxEntries = explorerConfig.limits.maxTreeEntries;

      let totalEntries = 0;

      let truncated = false;

      async function buildTree(currentDirectory, relativePath, depth) {
        /*
         * Stop recursion when maximum depth is reached.
         */

        if (depth > maxDepth) {
          truncated = true;

          return {
            name: path.basename(currentDirectory) || ".",

            type: "directory",

            path: relativePath,

            children: [],

            truncated: true,
          };
        }

        /*
         * Stop when maximum number of entries is reached.
         */

        if (totalEntries >= maxEntries) {
          truncated = true;

          return null;
        }

        const entries = await fs.readdir(currentDirectory, {
          withFileTypes: true,
        });

        const filteredEntries = entries.filter((entry) => {
          if (entry.isDirectory() && isIgnoredDirectory(entry.name)) {
            return false;
          }

          if (entry.isFile() && isIgnoredFile(entry.name)) {
            return false;
          }

          return true;
        });

        sortDirents(filteredEntries);

        const children = [];

        for (const entry of filteredEntries) {
          if (totalEntries >= maxEntries) {
            truncated = true;
            break;
          }

          totalEntries++;

          const entryPath = path.join(currentDirectory, entry.name);

          const entryRelativePath = path.join(relativePath, entry.name);

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
        success: true,

        operation: "list_directory_tree",

        path: getRelativePath(rootDirectory),

        tree,

        totalEntries,

        maxDepth,

        maxEntries,

        truncated,
      };
    },

    async searchFiles(query, targetPath = ".") {
      if (typeof query !== "string" || !query.trim()) {
        throw new Error("Search query cannot be empty.");
      }

      const normalizedQuery = query.trim().toLowerCase();

      const directory = resolveWorkspacePath(targetPath);

      const directoryStats = await fs.stat(directory);

      if (!directoryStats.isDirectory()) {
        throw new Error("The search path is not a directory.");
      }

      const results = [];

      const maxResults = explorerConfig.limits.maxSearchResults;

      async function searchDirectory(currentDirectory) {
        if (results.length >= maxResults) {
          return;
        }

        const entries = await fs.readdir(currentDirectory, {
          withFileTypes: true,
        });

        sortDirents(entries);

        for (const entry of entries) {
          if (results.length >= maxResults) {
            return;
          }

          /*
           * Ignore directories.
           */

          if (entry.isDirectory() && isIgnoredDirectory(entry.name)) {
            continue;
          }

          /*
           * Ignore files.
           */

          if (entry.isFile() && isIgnoredFile(entry.name)) {
            continue;
          }

          const entryPath = path.join(currentDirectory, entry.name);

          /*
           * Recursively search directories.
           */

          if (entry.isDirectory()) {
            await searchDirectory(entryPath);

            continue;
          }

          /*
           * Filename matching only.
           */

          if (entry.name.toLowerCase().includes(normalizedQuery)) {
            results.push({
              name: entry.name,

              path: getRelativePath(entryPath),

              type: "file",
            });
          }
        }
      }

      await searchDirectory(directory);

      return {
        success: true,

        operation: "search_files",

        query: query.trim(),

        path: getRelativePath(directory),

        results,

        total: results.length,

        truncated: results.length >= maxResults,
      };
    },

    async readFile(targetPath) {
      if (typeof targetPath !== "string" || !targetPath.trim()) {
        throw new Error("File path cannot be empty.");
      }

      const cleanPath = targetPath.trim();

      const filePath = resolveWorkspacePath(cleanPath);

      const fileName = path.basename(filePath);

      if (isIgnoredFile(fileName)) {
        throw new Error("Access denied: file is ignored.");
      }

      const stats = await fs.stat(filePath);

      if (!stats.isFile()) {
        throw new Error("The specified path is not a file.");
      }

      const fileType = getFileType(filePath);

      if (fileType === "unsupported") {
        throw new Error(
          `Unsupported file type: ${path.extname(filePath) || "unknown"}`,
        );
      }

      const relativePath = getRelativePath(filePath);

      if (fileType === "text") {
        if (stats.size > explorerConfig.limits.maxFileSize) {
          throw new Error(
            `File is too large. ` +
            `Maximum allowed size is ${formatBytes(
              explorerConfig.limits.maxFileSize,
            )}.`,
          );
        }

        const content = await readTextFile(filePath);

        return {
          success: true,

          operation: "read_file",

          name: fileName,

          path: relativePath,

          type: "text",

          size: stats.size,

          sizeFormatted: formatBytes(stats.size),

          content,
        };
      }

      if (fileType === "pdf") {
        if (stats.size > explorerConfig.limits.maxDocumentSize) {
          throw new Error(
            `PDF is too large. ` +
            `Maximum allowed size is ${formatBytes(
              explorerConfig.limits.maxDocumentSize,
            )}.`,
          );
        }

        const result = await readPdfFile(filePath);

        return {
          success: true,

          operation: "read_file",

          name: fileName,

          path: relativePath,

          type: "pdf",

          size: stats.size,

          sizeFormatted: formatBytes(stats.size),

          pages: result.pages,

          content: result.content,
        };
      }

      /*
       * ========================================================
       * DOCX
       * ========================================================
       */

      if (fileType === "docx") {
        if (stats.size > explorerConfig.limits.maxDocumentSize) {
          throw new Error(
            `DOCX is too large. ` +
            `Maximum allowed size is ${formatBytes(
              explorerConfig.limits.maxDocumentSize,
            )}.`,
          );
        }

        const result = await readDocxFile(filePath);

        return {
          success: true,

          operation: "read_file",

          name: fileName,

          path: relativePath,

          type: "docx",

          size: stats.size,

          sizeFormatted: formatBytes(stats.size),

          content: result.content,

          messages: result.messages,
        };
      }

      /*
       * ========================================================
       * IMAGE
       * ========================================================
       */

      if (fileType === "image") {
        const maxImageSize =
          explorerConfig.limits.maxImageSize ?? 10 * 1024 * 1024;

        if (stats.size > maxImageSize) {
          throw new Error(
            `Image is too large. ` +
            `Maximum allowed size is ${formatBytes(maxImageSize)}.`,
          );
        }

        const result = await readImageFile(filePath);

        return {
          success: true,

          operation: "read_file",

          name: result.name,

          path: relativePath,

          type: "image",

          size: result.size,

          sizeFormatted: formatBytes(result.size),

          mediaType: result.mediaType,

          data: result.data,
        };
      }

      throw new Error(`Unsupported file type: ${fileType}`);
    },

    async writeFile(targetPath, content) {
      if (typeof targetPath !== "string" || !targetPath.trim()) {
        throw new Error("File path cannot be empty.");
      }

      /*
       * Content must actually exist.
       */

      if (typeof content !== "string") {
        throw new Error("File content must be a string.");
      }

      /*
       * IMPORTANT:
       *
       * Never allow the agent to create
       * an empty file accidentally.
       */

      if (content.trim().length === 0) {
        throw new Error(
          "Cannot create or overwrite a file with empty content.",
        );
      }

      const cleanPath = targetPath.trim();

      const filePath = resolveWorkspacePath(cleanPath);

      const fileName = path.basename(filePath);

      /*
       * Never write ignored files.
       */

      if (isIgnoredFile(fileName)) {
        throw new Error("Access denied: cannot write to an ignored file.");
      }

      /*
       * write_file only supports text/source files.
       */

      const extensionType = getFileType(filePath);

      if (extensionType !== "text") {
        throw new Error(
          "write_file currently supports text/source files only.",
        );
      }

      /*
       * Check content size BEFORE writing.
       */

      const contentSize = Buffer.byteLength(content, "utf8");

      const maxWriteSize = getMaxWriteSize();

      if (contentSize > maxWriteSize) {
        throw new Error(
          `Content is too large. ` +
          `Maximum allowed size is ${formatBytes(maxWriteSize)}.`,
        );
      }

      let existed = false;

      let previousSize = 0;

      /*
       * Check existing path.
       */

      try {
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
          throw new Error("Cannot write file content to a directory.");
        }

        if (stats.isFile()) {
          existed = true;
          previousSize = stats.size;
        }
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }

      /*
       * Make sure the parent directory exists.
       */

      const parentDirectory = path.dirname(filePath);

      await fs.mkdir(parentDirectory, {
        recursive: true,
      });

      /*
       * Write the complete content.
       */

      await fs.writeFile(filePath, content, "utf8");

      /*
       * Verify the file after writing.
       */

      const stats = await fs.stat(filePath);

      if (!stats.isFile()) {
        throw new Error(
          "File write completed but the resulting path is not a file.",
        );
      }

      /*
       * Read back the file to verify
       * that the filesystem contains content.
       */

      const writtenContent = await fs.readFile(filePath, "utf8");

      if (writtenContent !== content) {
        throw new Error(
          "File verification failed: written content does not match the requested content.",
        );
      }

      return {
        success: true,

        operation: existed ? "overwrite" : "create",

        name: fileName,

        path: getRelativePath(filePath),

        size: stats.size,

        sizeFormatted: formatBytes(stats.size),

        previousSize,

        created: !existed,

        overwritten: existed,

        verified: true,
      };
    },

    async editFile(targetPath, oldText, newText) {
      if (typeof targetPath !== "string" || !targetPath.trim()) {
        throw new Error("File path cannot be empty.");
      }

      if (typeof oldText !== "string") {
        throw new Error("oldText must be a string.");
      }

      if (typeof newText !== "string") {
        throw new Error("newText must be a string.");
      }

      if (oldText.length === 0) {
        throw new Error("oldText cannot be empty.");
      }

      const cleanPath = targetPath.trim();

      const filePath = resolveWorkspacePath(cleanPath);

      const fileName = path.basename(filePath);

      /*
       * Never edit ignored files.
       */

      if (isIgnoredFile(fileName)) {
        throw new Error("Access denied: cannot edit an ignored file.");
      }

      const stats = await fs.stat(filePath);

      if (!stats.isFile()) {
        throw new Error("The specified path is not a file.");
      }

      /*
       * Ensure this is an editable file.
       */

      const fileType = assertEditableFile(filePath);

      /*
       * File size limit.
       */

      if (stats.size > explorerConfig.limits.maxFileSize) {
        throw new Error(
          `File is too large. ` +
          `Maximum allowed size is ${formatBytes(
            explorerConfig.limits.maxFileSize,
          )}.`,
        );
      }

      /*
       * Read current content.
       */

      const currentContent = await readTextFile(filePath);

      /*
       * Count exact occurrences.
       */

      const occurrences = currentContent.split(oldText).length - 1;

      /*
       * Nothing found.
       */

      if (occurrences === 0) {
        throw new Error("The specified oldText was not found in the file.");
      }

      /*
       * Multiple matches are dangerous.
       *
       * Do NOT guess which occurrence
       * the user intended.
       */

      if (occurrences > 1) {
        throw new Error(
          `The specified oldText was found ${occurrences} times. Refusing to edit ambiguously. Provide a larger unique section.`,
        );
      }

      /*
       * Generate new file content.
       */

      const updatedContent = currentContent.replace(oldText, newText);

      /*
       * Prevent accidental empty files.
       */

      if (updatedContent.trim().length === 0) {
        throw new Error(
          "Edit would result in an empty file. Refusing the operation.",
        );
      }

      /*
       * Check final size.
       */

      const updatedSize = Buffer.byteLength(updatedContent, "utf8");

      const maxWriteSize = getMaxWriteSize();

      if (updatedSize > maxWriteSize) {
        throw new Error(
          `Updated file is too large. ` +
          `Maximum allowed size is ${formatBytes(maxWriteSize)}.`,
        );
      }

      /*
       * Write the modified content.
       */

      await fs.writeFile(filePath, updatedContent, "utf8");

      /*
       * Verify the modification.
       */

      const verifiedContent = await readTextFile(filePath);

      if (verifiedContent !== updatedContent) {
        throw new Error(
          "Edit verification failed: resulting file content does not match the expected content.",
        );
      }

      const finalStats = await fs.stat(filePath);

      return {
        success: true,

        operation: "edit",

        name: fileName,

        path: getRelativePath(filePath),

        type: fileType,

        previousSize: stats.size,

        previousSizeFormatted: formatBytes(stats.size),

        size: finalStats.size,

        sizeFormatted: formatBytes(finalStats.size),

        replacements: 1,

        verified: true,
      };
    },

    async deleteFile(targetPath) {
      if (typeof targetPath !== "string" || !targetPath.trim()) {
        throw new Error("File path cannot be empty.");
      }

      const cleanPath = targetPath.trim();

      /*
       * Do not allow deleting the
       * workspace root.
       */

      if (cleanPath === "." || cleanPath === "" || cleanPath === path.sep) {
        throw new Error("Refusing to delete the workspace root.");
      }

      const filePath = resolveWorkspacePath(cleanPath);

      const fileName = path.basename(filePath);

      /*
       * Never delete ignored files.
       */

      if (isIgnoredFile(fileName)) {
        throw new Error("Access denied: cannot delete an ignored file.");
      }

      const stats = await fs.stat(filePath);

      /*
       * Never delete directories.
       */

      if (stats.isDirectory()) {
        throw new Error("delete_file can only delete files, not directories.");
      }

      /*
       * Only regular files.
       */

      if (!stats.isFile()) {
        throw new Error("The specified path is not a regular file.");
      }

      const relativePath = getRelativePath(filePath);

      const size = stats.size;

      /*
       * Delete.
       */

      await fs.unlink(filePath);

      /*
       * Verify deletion.
       */

      try {
        await fs.access(filePath);

        /*
         * If access succeeds,
         * the file still exists.
         */

        throw new Error("Delete verification failed: the file still exists.");
      } catch (error) {
        /*
         * ENOENT is exactly what we want.
         */

        if (error.code !== "ENOENT") {
          throw error;
        }
      }

      return {
        success: true,

        operation: "delete",

        name: fileName,

        path: relativePath,

        size,

        sizeFormatted: formatBytes(size),

        deleted: true,

        verified: true,
      };
    },

    async createDirectory(targetPath) {
      if (typeof targetPath !== "string" || !targetPath.trim()) {
        throw new Error("Directory path cannot be empty.");
      }

      const cleanPath = targetPath.trim();
      const directory = resolveWorkspacePath(cleanPath);

      await fs.mkdir(directory, { recursive: true });

      const stats = await fs.stat(directory);

      if (!stats.isDirectory()) {
        throw new Error("Directory creation completed but the resulting path is not a directory.");
      }

      return {
        success: true,
        operation: "create_directory",
        path: getRelativePath(directory),
        created: true,
        verified: true
      }
    }


  };
}
