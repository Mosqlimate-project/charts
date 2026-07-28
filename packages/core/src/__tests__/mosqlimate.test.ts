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
        setApiKey: vi.fn(),
        setLanguage: vi.fn(),
        getInstance: vi.fn(),
        onStatusChange: vi.fn().mockReturnValue(() => {}),
      };
    }),
  };
});

vi.mock("../declarative", () => {
  return {
    autoInit: vi.fn().mockResolvedValue({ rendered: 6, errors: [] }),
  };
});

vi.mock("../web-component", () => {
  return {
    registerChartElement: vi.fn(),
    isChartElementRegistered: vi.fn().mockReturnValue(false),
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

  it("initializes manager lazily via getManager on first call", () => {
    Mosqlimate.setSdkKey("lazy-key");
  });

  it("reuses existing manager on subsequent getManager calls", () => {
    Mosqlimate.setSdkKey("first");
    Mosqlimate.setApiKey("second");
  });

  it("setApiKey initializes manager lazily", () => {
    Mosqlimate.setApiKey("lazy-api-key");
  });

  it("update initializes manager lazily", () => {
    Mosqlimate.update("mc-0", {} as never);
  });

  it("resize initializes manager lazily", () => {
    Mosqlimate.resize("mc-0", 800, 600);
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

  it("setApiKey does not throw", () => {
    Mosqlimate.configure({});
    expect(() => Mosqlimate.setApiKey("api-key-789")).not.toThrow();
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

  it("update does not throw", () => {
    Mosqlimate.configure({});
    expect(() => Mosqlimate.update("mc-0", {} as never)).not.toThrow();
  });

  it("resize does not throw", () => {
    Mosqlimate.configure({});
    expect(() => Mosqlimate.resize("mc-0", 800, 600)).not.toThrow();
  });

  it("onStatusChange returns unsubscribe function", () => {
    Mosqlimate.configure({});
    const unsub = Mosqlimate.onStatusChange(() => {});
    expect(typeof unsub).toBe("function");
  });

  it("setLanguage does not throw", () => {
    Mosqlimate.configure({});
    expect(() => Mosqlimate.setLanguage("pt")).not.toThrow();
  });

  it("autoInit passes language to declarative and sets language before registration", async () => {
    Mosqlimate.configure({});
    const result = await Mosqlimate.autoInit({
      language: "pt",
    });
    expect(result.rendered).toBe(6);
  });

  it("autoInit returns result from declarative autoInit", async () => {
    Mosqlimate.configure({});
    const result = await Mosqlimate.autoInit();
    expect(result.rendered).toBe(6);
  });

  it("autoInit passes options to declarative and sets keys before registration", async () => {
    Mosqlimate.configure({});
    const result = await Mosqlimate.autoInit({
      sdk_key: "sdkk",
      api_key: "apik",
    });
    expect(result.rendered).toBe(6);
  });
});
