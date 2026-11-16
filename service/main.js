// service/main.ts
import http from "node:http";
import path from "node:path";
import fs from "node:fs/promises";
import fssync from "node:fs";
import { fileURLToPath } from "node:url";
var __dirname = "/Users/wclin/openchamber/openchamber_graphify/service";
var port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
if (!port) {
  console.error("OPENCHAMBER_SERVICE_PORT is required");
  process.exit(1);
}
var token = process.env.OPENCHAMBER_SERVICE_TOKEN ?? "";
function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}
var __filename2 = path.resolve(fileURLToPath(import.meta.url));
var libCodePath = path.join(__dirname, "lib", "vis-network.min.js");
var cachedLibCode = null;
function ensureLocalVisNetwork(html) {
  const scriptPattern = /<script\s+src="https:\/\/unpkg\.com\/vis-network@9\.1\.6\/standalone\/umd\/vis-network\.min\.js"\s+integrity="[^"]+" crossorigin="anonymous"><\/script>/i;
  if (!cachedLibCode) {
    try {
      cachedLibCode = fssync.readFileSync(libCodePath, "utf8");
    } catch {
      cachedLibCode = "";
    }
  }
  return scriptPattern.test(html) && cachedLibCode ? html.replace(scriptPattern, `<script>
${cachedLibCode}
</script>`) : html;
}
function getLocalVisNetworkCode() {
  if (!cachedLibCode) {
    try {
      cachedLibCode = fssync.readFileSync(libCodePath, "utf8");
    } catch {
      cachedLibCode = "";
    }
  }
  return cachedLibCode ?? "";
}
function extractVariableArray(html, name) {
  const base = `const ${name} = `;
  let idx = html.indexOf(base);
  if (idx === -1)
    throw new Error(`Missing ${name} declaration`);
  idx += base.length;
  while (idx < html.length) {
    const ch = String(html[idx] ?? "");
    if (!/[\s\t\n]/.test(ch))
      break;
    idx++;
  }
  if (html[idx] !== "[")
    throw new Error(`Expected [ for ${name}`);
  let depth = 1;
  let inString = null;
  for (let i = idx + 1;i < html.length; i++) {
    const ch = html[i];
    if (!inString) {
      if (ch === '"' || ch === "'")
        inString = ch;
    } else if (ch === "\\") {
      i++;
    } else if (ch === inString) {
      inString = null;
    }
    if (!inString) {
      if (ch === "[" || ch === "{")
        depth++;
      else if (ch === "]" || ch === "}") {
        depth--;
      }
      if (depth === 0)
        return JSON.parse(html.slice(idx, i + 1));
    }
  }
  throw new Error(`Unterminated ${name}`);
}
async function readGraphHtml(directory) {
  const baseDir = path.resolve(directory);
  const graphPath = path.join(baseDir, "graphify-out", "graph.html");
  const rel = path.relative(baseDir, graphPath);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("not-found");
  }
  let html;
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
var server = http.createServer(async (req, res) => {
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
    let html;
    try {
      html = await readGraphHtml(directory);
    } catch (err) {
      if (err instanceof Error && err.message === "graph-not-found")
        return sendJson(res, 404, { error: "graph-not-found" });
      if (err instanceof Error && err.message === "not-found")
        return sendJson(res, 403, { error: "not-found" });
      return sendJson(res, 500, { error: err instanceof Error ? err.message : "read-error" });
    }
    sendJson(res, 200, { html: ensureLocalVisNetwork(html) });
    return;
  }
  if (req.method === "GET" && url.pathname === "/graph/data") {
    let html;
    try {
      html = await readGraphHtml(directory);
    } catch (err) {
      if (err instanceof Error && err.message === "graph-not-found")
        return sendJson(res, 404, { error: "graph-not-found" });
      if (err instanceof Error && err.message === "not-found")
        return sendJson(res, 403, { error: "not-found" });
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
  sendJson(res, 404, { error: "not-found" });
});
server.listen(port, "127.0.0.1");
console.log(`graphify status service listening on port ${port}`);
