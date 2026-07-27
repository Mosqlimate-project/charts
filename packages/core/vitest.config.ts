import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    VERSION: JSON.stringify("0.0.0-test"),
    WATERMARK_DATA_URI: JSON.stringify("data:image/png;base64,FAKE"),
  },
  test: {
    environment: "jsdom",
  },
});
