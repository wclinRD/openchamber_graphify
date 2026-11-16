// service/main.ts
import http from "node:http";
import path from "node:path";
import fs from "node:fs/promises";
import fssync from "node:fs";
import { fileURLToPath } from "node:url";

const port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
if (!port) {
  console.error("OPENCHAMBER_SERVICE_PORT is required");
  process.exit(1);
}

const token = process.env.OPENCHAMBER_SERVICE_TOKEN ?? "";

function sendJson(res: http.ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

// The graphify HTML always uses this exact unpkg URL. We replace it with an
// inline vis-network 9.1.6 UMD build so status-section iframes cannot be blocked
// by the OpenChammer network sandbox.
const __filename = path.resolve(fileURLToPath(import.meta.url));
const libCodePath = path.join(__dirname, "lib", "vis-network.min.js");
let cachedLibCode: string | null = null;

function ensureLocalVisNetwork(html: string): string {
  const scriptPattern = /<script\s+src="https:\/\/unpkg\.com\/vis-network@9\.1\.6\/standalone\/umd\/vis-network\.min\.js"\s+integrity="[^"]+" crossorigin="anonymous"><\/script>/i;
  if (!cachedLibCode) {
    try {
      cachedLibCode = fssync.readFileSync(libCodePath, "utf8");
    } catch {
      // If for some reason the local lib is missing, fall back to CDN; most OpenChammer
      // hosts do not allow external CDNs in status-section iframes, so this is only a
      // fallback when running outside the app's sandboxed service.
      cachedLibCode = "";
    }
  }
  return scriptPattern.test(html) && cachedLibCode ? html.replace(scriptPattern, `<script>\n${cachedLibCode}\n</script>`) : html;
}

function getLocalVisNetworkCode(): string {
  if (!cachedLibCode) {
    try {
      cachedLibCode = fssync.readFileSync(libCodePath, "utf8");
    } catch {
      cachedLibCode = "";
    }
  }
  return cachedLibCode ?? "";
}

function extractVariableArray(html: string, name: string): unknown {
  const base = `const ${name} = `;
  let idx = html.indexOf(base);
  if (idx === -1) throw new Error(`Missing ${name} declaration`);

  idx += base.length;
  while (idx < html.length) {
    const ch = String(html[idx] ?? '');
    if (!/[\s\t\n]/.test(ch)) break;
    idx++;
  }
  if (html[idx] !== '[') throw new Error(`Expected [ for ${name}`);

  let depth = 1;
  // Track the open quote (`"` or `'`) so we correctly exit string mode.
  let inString: '"' | "'" | null = null;

  for (let i = idx + 1; i < html.length; i++) {
    const ch = html[i];

    if (!inString) {
      if (ch === '"' || ch === "'") inString = ch as any;
    } else if (ch === '\\') {
      i++; // skip the character after a backslash; inString remains unchanged.
    } else if (ch === inString) {
      inString = null; // closed string.
    }

    if (!inString) {
      if (ch === '[' || ch === '{') depth++;
      else if (ch === ']' || ch === '}') {
        depth--;
      }

      if (depth === 0) return JSON.parse(html.slice(idx, i + 1));
    }
  }

  throw new Error(`Unterminated ${name}`);
}

async function readGraphHtml(directory: string) {
  const baseDir = path.resolve(directory);
  const graphPath = path.join(baseDir, "graphify-out", "graph.html");

  // Ensure the requested graph file stays inside the given project directory.
  const rel = path.relative(baseDir, graphPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error("not-found");
  }

  let html: string;
  try {
    html = await fs.readFile(graphPath, "utf8");
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      throw new Error("graph-not-found");
    }
    throw err;
  }

  return html;
}

async function readGraphReport(directory: string): Promise<string> {
  const baseDir = path.resolve(directory);
  const reportPath = path.join(baseDir, "graphify-out", "GRAPH_REPORT.md");

  const rel = path.relative(baseDir, reportPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error("not-found");
  }

  let text: string;
  try {
    text = await fs.readFile(reportPath, "utf8");
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      throw new Error("report-not-found");
    }
    throw err;
  }

  return text;
}

async function readAnalysisJson(directory: string): Promise<unknown> {
  const baseDir = path.resolve(directory);
  const analysisPath = path.join(baseDir, "graphify-out", ".graphify_analysis.json");

  const rel = path.relative(baseDir, analysisPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error("not-found");
  }

  let text: string;
  try {
    text = await fs.readFile(analysisPath, "utf8");
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      throw new Error("analysis-not-found");
    }
    throw err;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("analysis-parse-error");
  }
}

async function readManifest(directory: string): Promise<unknown> {
  const baseDir = path.resolve(directory);
  const manifestPath = path.join(baseDir, "graphify-out", "manifest.json");

  const rel = path.relative(baseDir, manifestPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error("not-found");
  }

  let text: string;
  try {
    text = await fs.readFile(manifestPath, "utf8");
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      throw new Error("manifest-not-found");
    }
    throw err;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("manifest-parse-error");
  }
}

const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.headers.authorization !== `Bearer ${token}`) {
    sendJson(res, 401, { error: "unauthorized" });
    return;
  }

  const url = new URL(req.url ?? "/", "http://127.0.0.1");

  if (url.pathname === "/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  const directory = url.searchParams.get("directory") ?? "";
  if (!path.isAbsolute(directory)) {
    sendJson(res, 400, { error: "bad-request" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/graph") {
    let html: string;
    try { html = await readGraphHtml(directory); } catch (err) {
      if (err instanceof Error && err.message === "graph-not-found") return sendJson(res, 404, { error: "graph-not-found" });
      if (err instanceof Error && err.message === "not-found") return sendJson(res, 403, { error: "not-found" });
      return sendJson(res, 500, { error: err instanceof Error ? err.message : "read-error" });
    }

    sendJson(res, 200, { html: ensureLocalVisNetwork(html) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/graph/data") {
    let html: string;
    try { html = await readGraphHtml(directory); } catch (err) {
      if (err instanceof Error && err.message === "graph-not-found") return sendJson(res, 404, { error: "graph-not-found" });
      if (err instanceof Error && err.message === "not-found") return sendJson(res, 403, { error: "not-found" });
      return sendJson(res, 500, { error: err instanceof Error ? err.message : "read-error" });
    }

    try {
      const nodes = extractVariableArray(html, "RAW_NODES");
      const edges = extractVariableArray(html, "RAW_EDGES");
      sendJson(res, 200, { nodes, edges, visNetworkLibCode: getLocalVisNetworkCode() });
    } catch (parseError) {
      return sendJson(res, 400, { error: "parse-error" });
    }

    return;
  }

  if (req.method === "GET" && url.pathname === "/api/report") {
    let report: string;
    try { report = await readGraphReport(directory); } catch (err) {
      if (err instanceof Error && err.message === "report-not-found") return sendJson(res, 404, { error: "graph not found" });
      if (err instanceof Error && err.message === "not-found") return sendJson(res, 403, { error: "not-found" });
      return sendJson(res, 500, { error: err instanceof Error ? err.message : "read-error" });
    }

    sendJson(res, 200, { report });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/analysis") {
    let analysis: unknown;
    try { analysis = await readAnalysisJson(directory); } catch (err) {
      if (err instanceof Error && (err.message === "analysis-not-found" || err.message === "analysis-parse-error")) return sendJson(res, 404, { error: "graph not found" });
      if (err instanceof Error && err.message === "not-found") return sendJson(res, 403, { error: "not-found" });
      return sendJson(res, 500, { error: err instanceof Error ? err.message : "read-error" });
    }

    sendJson(res, 200, { analysis });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/manifest") {
    let manifest: unknown;
    try { manifest = await readManifest(directory); } catch (err) {
      if (err instanceof Error && (err.message === "manifest-not-found" || err.message === "manifest-parse-error")) return sendJson(res, 404, { error: "graph not found" });
      if (err instanceof Error && err.message === "not-found") return sendJson(res, 403, { error: "not-found" });
      return sendJson(res, 500, { error: err instanceof Error ? err.message : "read-error" });
    }

    sendJson(res, 200, { manifest });
    return;
  }

  sendJson(res, 404, { error: "not-found" });
});

server.listen(port, "127.0.0.1");
console.log(`graphify status service listening on port ${port}`);
