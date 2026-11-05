#!/usr/bin/env node
/**
 * Creates the-conversation/ under one limb repo (sibling of the trunk).
 *
 * Usage (from the limb repo root):
 *   node /path/to/scaffold-the-conversation.mjs [--force]
 *
 * Usage (from trunk, pass the limb directory):
 *   node .cursor/skills/sprout-skills/sprout-to-limb/scaffold-the-conversation.mjs ../limb-people-keeper [--force]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const force = process.argv.includes("--force");
const args = process.argv.slice(2).filter((a) => a !== "--force");
const limbRoot = path.resolve(args[0] || process.cwd());

function writeIfAbsent(file, body) {
  if (!force && fs.existsSync(file)) {
    console.warn("skip (exists):", file);
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, "utf8");
  console.log("wrote:", file);
}

const LANES = ["build", "marketing", "revenue"];
const stub = (title) => `# ${title}\n\n- …\n`;

if (!path.basename(limbRoot).startsWith("limb-")) {
  console.error("Expected a limb-* directory, got:", limbRoot);
  process.exit(1);
}

const base = path.join(limbRoot, "the-conversation");
for (const lane of LANES) {
  writeIfAbsent(path.join(base, lane, ".gitkeep"), "");
}
writeIfAbsent(path.join(base, "liveListing.md"), stub("Live listing"));
console.log("Done. limb =", limbRoot);
