import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import * as constants from "./constants";

const SRC_DIR = path.resolve(__dirname, "..");

/**
 * Recursively find all .ts and .tsx files under a directory,
 * skipping node_modules and test files.
 */
function getSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      files.push(...getSourceFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Parse named imports from `@/lib/constants` in a file's source text.
 * Returns an array of { name, file } for each imported identifier.
 */
function parseConstantsImports(source: string, filePath: string) {
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*["']@\/lib\/constants["']/g;
  const results: { name: string; file: string }[] = [];

  let match;
  while ((match = importRegex.exec(source)) !== null) {
    const names = match[1].split(",").map((s) => {
      // Handle `import { type Foo }` and `import { Foo as Bar }`
      const trimmed = s.trim().replace(/^type\s+/, "");
      return trimmed.split(/\s+as\s+/)[0].trim();
    });
    for (const name of names) {
      if (name) results.push({ name, file: filePath });
    }
  }
  return results;
}

describe("@/lib/constants exports", () => {
  const exportedNames = Object.keys(constants);
  const sourceFiles = getSourceFiles(SRC_DIR);

  const allImports: { name: string; file: string }[] = [];
  for (const filePath of sourceFiles) {
    const source = fs.readFileSync(filePath, "utf-8");
    allImports.push(...parseConstantsImports(source, filePath));
  }

  it("should have at least one import to validate", () => {
    expect(allImports.length).toBeGreaterThan(0);
  });

  for (const { name, file } of allImports) {
    const relativeFile = path.relative(SRC_DIR, file);
    it(`should export "${name}" (imported in ${relativeFile})`, () => {
      expect(
        exportedNames,
        `"${name}" is imported in ${relativeFile} but is not exported from @/lib/constants. ` +
          `Available exports: ${exportedNames.join(", ")}`
      ).toContain(name);
    });
  }
});
