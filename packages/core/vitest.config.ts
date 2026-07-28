import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    VERSION: JSON.stringify("0.0.0-test"),
    WATERMARK_DATA_URI: JSON.stringify("data:image/png;base64,FAKE"),
  },
  test: {
    environment: "jsdom",
    setupFiles: ["src/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/__tests__/**",
        "src/index.ts",
        "src/types.ts",
        "src/renderer.ts",
        "src/charts/**",
      ],
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
});
