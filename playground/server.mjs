import { createServer } from "node:http";
import { request as httpRequest } from "node:http";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIRNAME =
  typeof import.meta.dirname === "string"
    ? import.meta.dirname
    : dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(DIRNAME, "..");

function loadEnvFile(filePath) {
  try {
    const raw = readFileSync(filePath, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!(key in process.env)) process.env[key] = val;
    }
    console.error(`  Loaded env from ${filePath}`);
    return true;
  } catch {
    return false;
  }
}

// Load charts' .env first, then Data-platform's as override
const DATA_PLATFORM_ROOT = resolve(ROOT, "..", "Data-platform");
loadEnvFile(resolve(ROOT, ".env"));
loadEnvFile(resolve(DATA_PLATFORM_ROOT, ".env"));

const PORT = Number(process.env.PORT) || 3000;
const API_BASE =
  process.env.MOSQLIMATE_API_BASE || "https://api.mosqlimate.org";

const API_KEY = process.env.API_KEY;
const SDK_KEY = process.env.SDK_KEY || API_KEY;
if (!SDK_KEY || !API_KEY) {
  console.error(
    "\n  ERROR: SDK_KEY and API_KEY are required. Set both in .env.\n",
  );
  process.exit(1);
}

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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, X-SDK-Key, X-UID-Key, Authorization",
  "Access-Control-Max-Age": "86400",
};

function writeCorsHeaders(res) {
  for (const [key, val] of Object.entries(CORS_HEADERS)) {
    res.setHeader(key, val);
  }
}

function proxyRequest(req, res) {
  const MAX_REDIRECTS = 5;

  function doRequest(url, redirects) {
    const headers = { ...req.headers };
    delete headers.host;
    headers.host = url.host;
    headers["X-SDK-Key"] = SDK_KEY;
    headers["X-UID-Key"] = API_KEY;

    const proxyReq = httpRequest(
      url,
      { method: req.method, headers },
      (proxyRes) => {
        if (
          redirects > 0 &&
          proxyRes.statusCode >= 300 &&
          proxyRes.statusCode < 400 &&
          proxyRes.headers.location
        ) {
          const next = new URL(proxyRes.headers.location, url);
          console.error(`  proxy ${url} -> ${next} (${proxyRes.statusCode})`);
          doRequest(next, redirects - 1);
          return;
        }

        const chunks = [];
        proxyRes.on("data", (chunk) => chunks.push(chunk));
        proxyRes.on("end", () => {
          const body = Buffer.concat(chunks);
          const responseHeaders = { ...proxyRes.headers };
          responseHeaders["access-control-allow-origin"] = "*";

          if (proxyRes.statusCode >= 400) {
            console.error(
              `  chart error: ${url} -> ${proxyRes.statusCode} ${body.toString()}`,
            );
            res.writeHead(proxyRes.statusCode, {
              "Content-Type": "application/json",
              ...CORS_HEADERS,
            });
            res.end(
              JSON.stringify({
                error: `chart API error: ${proxyRes.statusCode}`,
                detail: body.toString(),
              }),
            );
            return;
          }

          res.writeHead(proxyRes.statusCode, responseHeaders);
          res.end(body);
        });
      },
    );

    proxyReq.on("error", (err) => {
      console.error(`  proxy error: ${err.message}`);
      if (!res.headersSent) {
        res.writeHead(502, {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        });
      }
      res.end(JSON.stringify({ error: err.message }));
    });

    req.pipe(proxyReq);
  }

  doRequest(new URL(req.url, API_BASE), MAX_REDIRECTS);
}

async function handler(req, res) {
  console.error(`  => ${req.method} ${req.url}`);
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = url.pathname;

  if (req.method === "OPTIONS") {
    writeCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === "/") pathname = "/playground/index.html";

  if (pathname.startsWith("/api/")) {
    return proxyRequest(req, res);
  }

  try {
    const filePath = resolve(ROOT, `.${pathname}`);
    let data = await readFile(filePath);
    const ext = extname(filePath);
    if (extname(pathname) === ".html") {
      data = Buffer.from(
        data
          .toString("utf-8")
          .replace(
            "<!--CONFIG-->",
            `<script>window.__MOSQLIMATE_API_KEY__=${JSON.stringify(API_KEY)}</script>`,
          ),
      );
    }
    writeCorsHeaders(res);
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

function startServer(port) {
  const server = createServer(handler);
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`  Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(`  Server error: ${err.message}`);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    console.log(`\n  Mosqlimate Charts Playground\n`);
    console.log(`  Local:   http://localhost:${port}`);
    console.log(`  Backend: ${API_BASE}`);
    console.log(`  Proxy:   /api/* -> ${API_BASE} (when used)\n`);
  });
}

startServer(PORT);
