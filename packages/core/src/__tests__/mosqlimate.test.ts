import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubGlobal("VERSION", "0.0.0-test");

vi.mock("../chart-manager", () => {
  return {
    ChartManager: vi.fn().mockImplementation(function () {
      return {
        render: vi.fn().mockResolvedValue({ id: "mc-test", status: "ready" }),
        update: vi.fn(),
        resize: vi.fn(),
        destroy: vi.fn(),
        destroyAll: vi.fn(),
        setSdkKey: vi.fn(),
        getInstance: vi.fn(),
        onStatusChange: vi.fn().mockReturnValue(() => {}),
      };
    }),
  };
});

import { Mosqlimate } from "../mosqlimate";

describe("Mosqlimate singleton", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("has a version string", () => {
    expect(Mosqlimate.version).toBe("0.0.0-test");
  });

  it("configure creates a new manager", () => {
    expect(() => Mosqlimate.configure({ theme: "dark" })).not.toThrow();
  });

  it("configure accepts sdk_key", () => {
    expect(() =>
      Mosqlimate.configure({
        theme: "dark",
        sdk_key: "test-key",
      }),
    ).not.toThrow();
  });

  it("setSdkKey does not throw", () => {
    Mosqlimate.configure({});
    expect(() => Mosqlimate.setSdkKey("key-123")).not.toThrow();
  });

  it("render delegates to manager", async () => {
    Mosqlimate.configure({});
    const container = document.createElement("div");
    document.body.appendChild(container);

    const instance = await Mosqlimate.render({
      target: container,
      chart: "infodengue/rt",
      params: {
        disease: "dengue",
        geocode: 3550308,
        start: "2024-01-01",
        end: "2024-01-31",
      },
    });

    expect(instance.id).toBe("mc-test");
    expect(instance.status).toBe("ready");
  });

  it("destroy does not throw", () => {
    Mosqlimate.configure({});
    expect(() => Mosqlimate.destroy("mc-0")).not.toThrow();
  });

  it("destroyAll does not throw", () => {
    Mosqlimate.configure({});
    expect(() => Mosqlimate.destroyAll()).not.toThrow();
  });

  it("onStatusChange returns unsubscribe function", () => {
    Mosqlimate.configure({});
    const unsub = Mosqlimate.onStatusChange(() => {});
    expect(typeof unsub).toBe("function");
  });
});
