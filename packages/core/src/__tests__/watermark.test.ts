import { describe, it, expect } from "vitest";
import { applyWatermark, removeWatermark } from "../watermark";

describe("watermark", () => {
  it("applies watermark with default white bg", () => {
    const el = document.createElement("div");
    applyWatermark(el);
    expect(el.style.backgroundImage).toContain("url(");
    expect(el.style.backgroundColor).toBe("rgb(255, 255, 255)");
    removeWatermark(el);
    expect(el.style.backgroundImage).toBe("");
  });

  it("preserves existing background color", () => {
    const el = document.createElement("div");
    el.style.backgroundColor = "rgb(200, 200, 200)";
    applyWatermark(el);
    expect(el.style.backgroundColor).toBe("rgb(200, 200, 200)");
    removeWatermark(el);
    expect(el.style.backgroundImage).toBe("");
    expect(el.style.backgroundColor).toBe("rgb(200, 200, 200)");
  });
});
