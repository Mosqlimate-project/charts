import { describe, it, expect } from "vitest";
import { applyWatermark, removeWatermark } from "../watermark";

describe("watermark", () => {
  function findWm(container: HTMLElement): HTMLElement | null {
    return container.querySelector(".mosqlimate-watermark");
  }

  it("applies watermark with default white bg", () => {
    const el = document.createElement("div");
    applyWatermark(el);
    const wm = findWm(el);
    expect(wm).not.toBeNull();
    expect(wm!.style.backgroundImage).toContain("url(");
    expect(wm!.style.opacity).toBe("0.5");
    expect(el.style.backgroundColor).toBe("rgb(255, 255, 255)");
    removeWatermark(el);
    expect(findWm(el)).toBeNull();
  });

  it("preserves existing background color", () => {
    const el = document.createElement("div");
    el.style.backgroundColor = "rgb(200, 200, 200)";
    applyWatermark(el);
    expect(el.style.backgroundColor).toBe("rgb(200, 200, 200)");
    removeWatermark(el);
    expect(findWm(el)).toBeNull();
    expect(el.style.backgroundColor).toBe("rgb(200, 200, 200)");
  });

  it("does not duplicate watermark", () => {
    const el = document.createElement("div");
    applyWatermark(el);
    applyWatermark(el);
    expect(el.querySelectorAll(".mosqlimate-watermark").length).toBe(1);
  });

  it("removeWatermark without a watermark is a no-op", () => {
    const el = document.createElement("div");
    removeWatermark(el);
    expect(findWm(el)).toBeNull();
  });
});
