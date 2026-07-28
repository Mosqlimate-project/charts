import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ChartManager } from "../chart-manager";

const mockFetchChart = vi.fn();
const mockSetSdkKey = vi.fn();

vi.mock("../api-client", () => {
  return {
    ApiClient: vi.fn().mockImplementation(function () {
      return {
        fetchChart: mockFetchChart,
        setSdkKey: mockSetSdkKey,
      };
    }),
  };
});

vi.mock("../charts", () => {
  class MockRenderer {
    render = vi.fn().mockResolvedValue(undefined);
    update = vi.fn();
    resize = vi.fn();
    destroy = vi.fn();
  }
  return {
    RtChart: MockRenderer,
    TemperatureChart: MockRenderer,
    AccumulatedWaterfallChart: MockRenderer,
    AirChart: MockRenderer,
    EggsDensityChart: MockRenderer,
    PositivityChart: MockRenderer,
    MapChart: MockRenderer,
    ScatterChart: MockRenderer,
  };
});

function createContainer(): HTMLElement {
  const div = document.createElement("div");
  document.body.appendChild(div);
  return div;
}

function makeRtResponse() {
  return {
    chart: "infodengue/rt" as const,
    category: "infodengue" as const,
    data: [{ data_iniSE: "2024-01-07", Rt: 1.2 }],
  };
}

describe("ChartManager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mockFetchChart.mockReset();
    mockSetSdkKey.mockReset();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("render", () => {
    it("creates instance with loading status then transitions to ready", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      const instance = await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      expect(instance.status).toBe("ready");
      expect(instance.error).toBeNull();
      expect(instance.data).toEqual(makeRtResponse());
      expect(instance.id).toMatch(/^mc-/);
    });

    it("sets error status on fetch failure", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockRejectedValue(new Error("API error 401"));

      const instance = await manager.render({
        target: container,
        chart: "climate/temperature",
        params: { geocode: 3550308, start: "2024-01-01", end: "2024-01-31" },
      });

      expect(instance.status).toBe("error");
      expect(instance.error?.message).toBe("API error 401");
      expect(container.querySelector("[role=alert]")).toBeTruthy();
    });

    it("throws when container selector not found", async () => {
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      await expect(
        manager.render({
          target: "#nonexistent",
          chart: "infodengue/rt",
          params: {
            disease: "dengue",
            geocode: 3550308,
            start: "2024-01-01",
            end: "2024-01-31",
          },
        }),
      ).rejects.toThrow("Container not found: #nonexistent");
    });

    it("accepts HTMLElement directly as target", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      const instance = await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      expect(instance.container).toBe(container);
    });
  });

  describe("lifecycle", () => {
    it("getInstance returns existing instance", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      const instance = await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      expect(manager.getInstance(instance.id)).toBe(instance);
    });

    it("destroy removes instance", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      const instance = await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      manager.destroy(instance.id);
      expect(manager.getInstance(instance.id)).toBeUndefined();
    });

    it("destroyAll removes all instances", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      manager.destroyAll();
      expect(manager.getInstance("mc-0")).toBeUndefined();
    });
  });

  describe("status events", () => {
    it("emits loading and ready status", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      const events: Array<{
        status: string;
        chartId: string;
      }> = [];
      manager.onStatusChange((e) => events.push(e));

      await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      expect(events).toHaveLength(2);
      expect(events[0].status).toBe("loading");
      expect(events[1].status).toBe("ready");
    });

    it("emits loading and error status on failure", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockRejectedValue(new Error("fail"));

      const events: Array<{
        status: string;
        error?: Error;
      }> = [];
      manager.onStatusChange((e) => events.push(e));

      await manager.render({
        target: container,
        chart: "climate/temperature",
        params: { geocode: 3550308, start: "2024-01-01", end: "2024-01-31" },
      });

      expect(events).toHaveLength(2);
      expect(events[0].status).toBe("loading");
      expect(events[1].status).toBe("error");
      expect(events[1].error?.message).toBe("fail");
    });

    it("unsubscribe stops events", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      const events: string[] = [];
      const unsub = manager.onStatusChange((e) => events.push(e.status));

      await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      expect(events).toHaveLength(2);

      unsub();

      await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      expect(events).toHaveLength(2);
    });
  });

  describe("setSdkKey", () => {
    it("delegates to api client", () => {
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      manager.setSdkKey("key-123");
      expect(mockSetSdkKey).toHaveBeenCalledWith("key-123");
    });
  });

  describe("watermark", () => {
    it("appends watermark element after successful render", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      const wm = container.querySelector(".mosqlimate-watermark");
      expect(wm).toBeTruthy();
      expect(wm?.getAttribute("aria-hidden")).toBe("true");
      const style = wm?.getAttribute("style") ?? "";
      expect(style).toContain("position:");
      expect(style).toContain("absolute");
      expect(style).toContain("opacity:");
      expect(style).toContain("0.3");
    });

    it("does not append watermark on render error", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockRejectedValue(new Error("fail"));

      await manager.render({
        target: container,
        chart: "climate/temperature",
        params: { geocode: 3550308, start: "2024-01-01", end: "2024-01-31" },
      });

      expect(container.querySelector(".mosqlimate-watermark")).toBeNull();
    });

    it("removes watermark on destroy", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      const instance = await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      expect(container.querySelector(".mosqlimate-watermark")).toBeTruthy();

      manager.destroy(instance.id);

      expect(container.querySelector(".mosqlimate-watermark")).toBeNull();
    });

    it("sets container position to relative if static", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      await manager.render({
        target: container,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      expect(container.style.position).toBe("relative");
    });
  });
});
