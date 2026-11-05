#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname);
/** Trunk repo root (parent of `dashboard/`) */
const TRUNK_ROOT = path.resolve(__dirname, "..");
/** Sibling garden: limbs and sprouts live next to the trunk, not inside it. */
const TREE_PARENT = path.resolve(TRUNK_ROOT, "..");
const SPROUTS_ROOT = path.join(TREE_PARENT, "the-sprouts");
const PORT = 4173;
/** Persists PM dashboard free-text notes (UTF-8 plain text; JSON envelope over HTTP only). */
const DASHBOARD_NOTES_FILE = path.join(ROOT, "pm-dashboard-notes.txt");
const DASHBOARD_NOTES_MAX_BYTES = 512 * 1024;
/** Per-app scratch todos from PM dashboard table (JSON { rows: { [appName]: string } }). */
const DASHBOARD_ROW_TODOS_FILE = path.join(ROOT, "pm-dashboard-row-todos.json");
const DASHBOARD_ROW_TODOS_MAX_BYTES = 1024 * 1024;
const CONVERSATION_LANES = Object.freeze(["build", "marketing", "revenue"]);

function isInside(root, full) {
  const rootResolved = path.resolve(root);
  const normalizedRoot = rootResolved.endsWith(path.sep)
    ? rootResolved
    : rootResolved + path.sep;
  const fullResolved = path.resolve(full);
  return fullResolved === rootResolved || fullResolved.startsWith(normalizedRoot);
}

function gardenAllowRoots() {
  const roots = [TRUNK_ROOT, SPROUTS_ROOT];
  try {
    for (const name of fs.readdirSync(TREE_PARENT, { withFileTypes: true })) {
      if (name.isDirectory() && name.name.startsWith("limb-")) {
        roots.push(path.join(TREE_PARENT, name.name));
      }
    }
  } catch {
    /* empty */
  }
  return roots;
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".md")) return "text/markdown; charset=utf-8";
  return "text/plain; charset=utf-8";
}

const MD_VIEWER_FILE = path.join(ROOT, "md-view.html");

/** Serve the in-browser Markdown preview for navigations; raw text for `?raw=1` or non-HTML clients (curl/tools). */
function serveMarkdownOrViewer(req, res, absFile, searchParams) {
  const wantsRaw = searchParams.get("raw") === "1";
  const acceptsHtml = String(req.headers.accept || "").includes("text/html");
  if (!wantsRaw && acceptsHtml && fs.existsSync(MD_VIEWER_FILE)) {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(MD_VIEWER_FILE).pipe(res);
    return;
  }
  res.writeHead(200, { "Content-Type": "text/markdown; charset=utf-8" });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  fs.createReadStream(absFile).pipe(res);
}

/** Resolve a trunk-relative URL path; block traversal */
function safeTrunkFile(urlPathname) {
  const decoded = decodeURIComponent(urlPathname.replace(/^\/+/, ""));
  const full = path.resolve(TRUNK_ROOT, decoded);
  if (!isInside(TRUNK_ROOT, full)) return null;
  if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) return null;
  return full;
}

/**
 * Map dashboard URLs to sibling fruit repos.
 * /sprouts/x -> ../the-sprouts/x
 * /limbs/limb-x/y -> ../limb-x/y
 * /garden/limb-x/y or /garden/the-sprouts/y -> sibling folder
 */
function safeGardenFile(urlPathname) {
  const decoded = decodeURIComponent(urlPathname.replace(/^\/+/, ""));
  let full = null;
  if (decoded.startsWith("sprouts/")) {
    full = path.resolve(SPROUTS_ROOT, decoded.slice("sprouts/".length));
  } else if (decoded.startsWith("limbs/")) {
    const rest = decoded.slice("limbs/".length);
    full = path.resolve(TREE_PARENT, rest);
  } else if (decoded.startsWith("garden/")) {
    full = path.resolve(TREE_PARENT, decoded.slice("garden/".length));
  } else {
    return null;
  }
  if (!gardenAllowRoots().some((root) => isInside(root, full))) return null;
  if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) return null;
  return full;
}

function readLimitedBody(req, maxBytes, label = "Payload") {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error(`${label} too large`));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/** @returns {Record<string, string>} */
function sanitizeRowTodosRows(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [k, v] of Object.entries(raw)) {
    if (typeof k !== "string" || typeof v !== "string") continue;
    out[k] = v;
  }
  return out;
}

/**
 * Scan each limb's `the-conversation/{build,marketing,revenue}/` folders and list the files inside.
 * @returns {Record<string, Record<string, Array<{name: string, path: string}>>>}
 *   keyed by limb path (e.g. "limbs/limb-people-keeper") → lane → file entries.
 */
function listConversationFiles() {
  /** @type {Record<string, Record<string, Array<{name: string, path: string}>>>} */
  const out = {};
  let limbNames = [];
  try {
    limbNames = fs
      .readdirSync(TREE_PARENT, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith("limb-"))
      .map((d) => d.name);
  } catch {
    return out;
  }
  for (const limbName of limbNames) {
    const limbRel = `../${limbName}`;
    const limbAbs = path.join(TREE_PARENT, limbName);
    /** @type {Record<string, Array<{name: string, path: string}>>} */
    const lanes = {};
    let hasAny = false;
    for (const lane of CONVERSATION_LANES) {
      const laneDir = path.join(limbAbs, "the-conversation", lane);
      let entries = [];
      try {
        entries = fs.readdirSync(laneDir, { withFileTypes: true });
      } catch {
        lanes[lane] = [];
        continue;
      }
      const files = entries
        .filter((e) => e.isFile() && !e.name.startsWith("."))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b))
        .map((name) => ({
          name,
          path: `${limbRel}/the-conversation/${lane}/${name}`,
        }));
      lanes[lane] = files;
      if (files.length) hasAny = true;
    }
    if (hasAny) out[limbRel] = lanes;
  }
  return out;
}

/** @returns {Record<string, string>} */
function readRowTodosRowsFromDisk() {
  try {
    if (!fs.existsSync(DASHBOARD_ROW_TODOS_FILE)) return {};
    const parsed = JSON.parse(fs.readFileSync(DASHBOARD_ROW_TODOS_FILE, "utf8"));
    if (parsed && typeof parsed === "object" && parsed.rows && typeof parsed.rows === "object") {
      return sanitizeRowTodosRows(parsed.rows);
    }
    return sanitizeRowTodosRows(parsed);
  } catch {
    return {};
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  let pathname = url.pathname;
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  if (req.method === "POST" && pathname === "/api/refresh") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: true, message: "Reload the page to re-fetch apps.json." }));
    return;
  }

  if (pathname === "/api/dashboard-notes") {
    const jsonHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    };
    if (req.method === "GET") {
      try {
        const text = fs.existsSync(DASHBOARD_NOTES_FILE)
          ? fs.readFileSync(DASHBOARD_NOTES_FILE, "utf8")
          : "";
        res.writeHead(200, jsonHeaders);
        res.end(JSON.stringify({ text }));
      } catch (e) {
        res.writeHead(500, jsonHeaders);
        res.end(JSON.stringify({ error: String(e?.message ?? e) }));
      }
      return;
    }
    if (req.method === "PUT") {
      try {
        const raw = await readLimitedBody(req, DASHBOARD_NOTES_MAX_BYTES, "Notes");
        let text = "";
        try {
          const parsed = JSON.parse(raw);
          text = typeof parsed.text === "string" ? parsed.text : "";
        } catch {
          res.writeHead(400, jsonHeaders);
          res.end(JSON.stringify({ error: 'Expected JSON body with string property "text"' }));
          return;
        }
        fs.writeFileSync(DASHBOARD_NOTES_FILE, text, "utf8");
        res.writeHead(200, jsonHeaders);
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        const msg = String(e?.message ?? e);
        const code = msg.includes("too large") ? 413 : 500;
        res.writeHead(code, jsonHeaders);
        res.end(JSON.stringify({ error: msg }));
      }
      return;
    }
    res.writeHead(405, {
      "Content-Type": "application/json; charset=utf-8",
      Allow: "GET, PUT",
    });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  if (pathname === "/api/dashboard-row-todos") {
    const jsonHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    };
    if (req.method === "GET") {
      try {
        const rows = readRowTodosRowsFromDisk();
        res.writeHead(200, jsonHeaders);
        res.end(JSON.stringify({ rows }));
      } catch (e) {
        res.writeHead(500, jsonHeaders);
        res.end(JSON.stringify({ error: String(e?.message ?? e) }));
      }
      return;
    }
    if (req.method === "PUT") {
      try {
        const raw = await readLimitedBody(req, DASHBOARD_ROW_TODOS_MAX_BYTES, "Row todos");
        let rows = {};
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.rows === "object" && parsed.rows !== null) {
            rows = sanitizeRowTodosRows(parsed.rows);
          } else {
            res.writeHead(400, jsonHeaders);
            res.end(JSON.stringify({ error: 'Expected JSON body with object property "rows"' }));
            return;
          }
        } catch {
          res.writeHead(400, jsonHeaders);
          res.end(JSON.stringify({ error: "Invalid JSON body" }));
          return;
        }
        fs.writeFileSync(
          DASHBOARD_ROW_TODOS_FILE,
          `${JSON.stringify({ rows }, null, 2)}\n`,
          "utf8"
        );
        res.writeHead(200, jsonHeaders);
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        const msg = String(e?.message ?? e);
        const code = msg.includes("too large") ? 413 : 500;
        res.writeHead(code, jsonHeaders);
        res.end(JSON.stringify({ error: msg }));
      }
      return;
    }
    res.writeHead(405, {
      "Content-Type": "application/json; charset=utf-8",
      Allow: "GET, PUT",
    });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  if (pathname === "/api/conversation-files") {
    const jsonHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    };
    if (req.method !== "GET") {
      res.writeHead(405, { ...jsonHeaders, Allow: "GET" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
      return;
    }
    try {
      res.writeHead(200, jsonHeaders);
      res.end(JSON.stringify({ limbs: listConversationFiles() }));
    } catch (e) {
      res.writeHead(500, jsonHeaders);
      res.end(JSON.stringify({ error: String(e?.message ?? e) }));
    }
    return;
  }

  const repoRel =
    pathname === "/apps.json" ? "apps.json" : pathname.replace(/^\/+/, "");

  const trunkFile =
    pathname === "/apps.json" || pathname.startsWith("/examples/")
      ? safeTrunkFile(repoRel)
      : pathname.startsWith("/.cursor/")
        ? safeTrunkFile(repoRel)
        : pathname.startsWith("/sprouts/") ||
            pathname.startsWith("/limbs/") ||
            pathname.startsWith("/garden/")
          ? safeGardenFile(pathname)
          : null;

  if (trunkFile && req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" });
    res.end("Method Not Allowed");
    return;
  }

  if ((req.method === "GET" || req.method === "HEAD") && trunkFile) {
    if (trunkFile.endsWith(".md")) {
      serveMarkdownOrViewer(req, res, trunkFile, url.searchParams);
      return;
    }
    res.writeHead(200, { "Content-Type": contentType(trunkFile) });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(trunkFile).pipe(res);
    return;
  }

  const targetPath =
    pathname === "/" ? path.join(ROOT, "index.html") : path.join(ROOT, pathname);
  if (!targetPath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  if (targetPath.endsWith(".md") && targetPath !== MD_VIEWER_FILE) {
    serveMarkdownOrViewer(req, res, targetPath, url.searchParams);
    return;
  }

  res.writeHead(200, { "Content-Type": contentType(targetPath) });
  fs.createReadStream(targetPath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Dashboard server at http://localhost:${PORT}`);
  console.log(`apps.json: ${path.join(TRUNK_ROOT, "apps.json")}`);
  console.log(`dashboard notes: ${DASHBOARD_NOTES_FILE}`);
  console.log(`dashboard row todos: ${DASHBOARD_ROW_TODOS_FILE}`);
});
