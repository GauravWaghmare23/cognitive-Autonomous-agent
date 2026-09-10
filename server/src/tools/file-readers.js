import fs from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const TEXT_EXTENSIONS = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".json",
  ".jsonc",
  ".css",
  ".scss",
  ".html",
  ".md",
  ".txt",
  ".yaml",
  ".yml",
  ".xml",
  ".csv",
  ".sql",
  ".prisma",
]);

const IMAGE_MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export function getFileType(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (TEXT_EXTENSIONS.has(extension)) {
    return "text";
  }

  if (extension === ".pdf") {
    return "pdf";
  }

  if (extension === ".docx") {
    return "docx";
  }

  if (IMAGE_MIME_TYPES[extension]) {
    return "image";
  }

  const fileName = path.basename(filePath);

  if (
    fileName === "Dockerfile" ||
    fileName === ".gitignore" ||
    fileName === ".dockerignore"
  ) {
    return "text";
  }

  return "unsupported";
}

export async function readTextFile(filePath) {
  return fs.readFile(filePath, "utf8");
}

export async function readPdfFile(filePath) {
  const buffer = await fs.readFile(filePath);

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return {
      content: result.text,
      pages: result.total,
    };
  } finally {
    await parser.destroy();
  }
}

export async function readDocxFile(filePath) {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return {
    content: result.value,
    messages: result.messages,
  };
}

export async function readImageFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const mediaType = IMAGE_MIME_TYPES[extension];

  if (!mediaType) {
    throw new Error(`Unsupported image format: ${extension}`);
  }

  const buffer = await fs.readFile(filePath);

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image exceeds the maximum allowed size of ${MAX_IMAGE_SIZE / (1024 * 1024)} MB`,
    );
  }

  return {
    data: buffer.toString("base64"),
    mediaType,
    size: buffer.length,
    name: path.basename(filePath),
  };
}
