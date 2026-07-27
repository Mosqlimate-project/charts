import { defineConfig } from "tsup";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

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
  },
  banner: {
    js: `/* @mosqlimate/core v${pkg.version} */`,
  },
});
