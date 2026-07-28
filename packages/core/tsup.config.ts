import { defineConfig } from "tsup";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

function loadEnv(key) {
  const root = resolve(__dirname, "../..");
  const envPath = resolve(root, ".env");
  try {
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      if (trimmed.slice(0, idx).trim() === key) {
        return trimmed.slice(idx + 1).trim();
      }
    }
  } catch {
    // no .env file
  }
  return undefined;
}

const apiBase = loadEnv("MOSQLIMATE_API_BASE") || "https://api.mosqlimate.org";

const watermarkBuffer = readFileSync(
  resolve(__dirname, "src/assets/watermark.png"),
);
const watermarkDataUri = `data:image/png;base64,${watermarkBuffer.toString("base64")}`;

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  target: "es2020",
  outDir: "dist",
  define: {
    VERSION: JSON.stringify(pkg.version),
    WATERMARK_DATA_URI: JSON.stringify(watermarkDataUri),
    "process.env.MOSQLIMATE_API_BASE": JSON.stringify(apiBase),
  },
  banner: {
    js: `/* @mosqlimate/core v${pkg.version} */`,
  },
});
