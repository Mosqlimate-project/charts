import { createServer } from "node:http";
import { request as httpRequest } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

function loadEnv() {
  try {
    const raw = require("node:fs").readFileSync(resolve(ROOT, ".env"), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {}
}
loadEnv();

const PORT = Number(process.env.PORT) || 3000;
const API_BASE = process.env.MOSQLIMATE_API_BASE || "http://localhost:8042";
const ADMIN_UIDKEY = process.env.ADMIN_UIDKEY || "";

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".cjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".map": "application/json",
  ".d.ts": "text/plain",
  ".d.cts": "text/plain",
};

function proxyRequest(req, res) {
  const target = new URL(req.url, API_BASE);

  const headers = { ...req.headers };
  delete headers.host;
  headers.host = target.host;
  if (ADMIN_UIDKEY) {
    headers["x-uid-key"] = ADMIN_UIDKEY;
  }

  const proxyReq = httpRequest(
    target,
    { method: req.method, headers },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on("error", (err) => {
    console.error(`  proxy error: ${err.message}`);
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "application/json" });
    }
    res.end(JSON.stringify({ error: err.message }));
  });

  req.pipe(proxyReq);
}

async function handler(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = url.pathname;

  if (pathname === "/") pathname = "/playground/index.html";

  if (pathname.startsWith("/api/")) {
    return proxyRequest(req, res);
  }

  try {
    const filePath = resolve(ROOT, `.${pathname}`);
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}

const server = createServer(handler);
server.listen(PORT, () => {
  console.log(`\n  Mosqlimate Playground\n`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  API:     ${API_BASE} (proxied)\n`);
});
