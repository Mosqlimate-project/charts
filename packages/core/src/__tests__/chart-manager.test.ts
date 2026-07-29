import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ChartManager } from "../chart-manager";

const mockFetchChart = vi.fn();
const mockSetSdkKey = vi.fn();
const mockSetApiKey = vi.fn();

vi.mock("../api-client", () => {
  return {
    ApiClient: vi.fn().mockImplementation(function () {
      return {
        fetchChart: mockFetchChart,
        setSdkKey: mockSetSdkKey,
        setApiKey: mockSetApiKey,
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

    it("wraps non-Error rejection in Error object", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockRejectedValue("raw string error");

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

      expect(instance.status).toBe("error");
      expect(instance.error?.message).toBe("raw string error");
    });

    it("falls back to PlaceholderRenderer for unknown chart name", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      const instance = await manager.render({
        target: container,
        chart: "unknown/chart" as never,
        params: { start: "2024-01-01", end: "2024-01-31" },
      });

      expect(instance.status).toBe("ready");
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

    it("renders all chart types successfully", async () => {
      mockFetchChart.mockResolvedValue(makeRtResponse());
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      const charts = [
        "climate/accumulated-waterfall",
        "climate/umid-pressao-med",
        "contaovos/eggs_density",
        "contaovos/positivity",
        "contaovos/map",
        "contaovos/map/scatter",
      ] as const;

      for (const chart of charts) {
        const container = createContainer();
        const instance = await manager.render({
          target: container,
          chart,
          params: { start: "2024-01-01", end: "2024-12-31" },
        });
        expect(instance.status).toBe("ready");
      }
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

    it("destroy does nothing for unknown id", () => {
      const manager = new ChartManager({ theme: "light" }, "https://test.api");
      expect(() => manager.destroy("nonexistent")).not.toThrow();
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

    it("update calls renderer.update on existing instance", async () => {
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

      const newData = {
        chart: "infodengue/rt" as const,
        category: "infodengue" as const,
        data: [{ data_iniSE: "2024-02-01", Rt: 0.8 }],
      };
      manager.update(instance.id, newData);
      expect(instance.data).toEqual(newData);
    });

    it("update does nothing for unknown id", () => {
      const manager = new ChartManager({ theme: "light" }, "https://test.api");
      manager.update("nonexistent", {} as never);
    });

    it("resize does nothing for unknown id", () => {
      const manager = new ChartManager({ theme: "light" }, "https://test.api");
      manager.resize("nonexistent", 800, 600);
    });

    it("resize calls renderer.resize on existing instance", async () => {
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

      const renderer = instance.renderer;
      manager.resize(instance.id, 800, 600);
      expect(renderer.resize).toHaveBeenCalledWith(800, 600);
    });

    it("accepts string CSS selector as target", async () => {
      const container = createContainer();
      container.id = "test-chart";
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockResolvedValue(makeRtResponse());

      const instance = await manager.render({
        target: "#test-chart",
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

  describe("setApiKey", () => {
    it("delegates to api client", () => {
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      manager.setApiKey("api-key-456");
      expect(mockSetApiKey).toHaveBeenCalledWith("api-key-456");
    });
  });

  describe("setLanguage", () => {
    it("updates config language", () => {
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      manager.setLanguage("pt");
    });
  });

  describe("watermark", () => {
    function findWm(container: HTMLElement): HTMLElement | null {
      return container.querySelector(".mosqlimate-watermark");
    }

    it("applies watermark element after successful render", async () => {
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

      const wm = findWm(container);
      expect(wm).not.toBeNull();
      expect(wm!.style.backgroundImage).toContain("url(");
      expect(wm!.style.opacity).toBe("0.5");
      expect(wm!.style.top).toBe("30px");
      expect(wm!.style.right).toBe("30px");
    });

    it("does not apply watermark on render error", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "light" }, "https://test.api");

      mockFetchChart.mockRejectedValue(new Error("fail"));

      await manager.render({
        target: container,
        chart: "climate/temperature",
        params: { geocode: 3550308, start: "2024-01-01", end: "2024-01-31" },
      });

      expect(findWm(container)).toBeNull();
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

      expect(findWm(container)).not.toBeNull();

      manager.destroy(instance.id);

      expect(findWm(container)).toBeNull();
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

    it("uses dark theme background color", async () => {
      const container = createContainer();
      const manager = new ChartManager({ theme: "dark" }, "https://test.api");

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

      expect(container.style.backgroundColor).toBe("rgb(26, 26, 46)");
    });

    it("does not override existing container background", async () => {
      const container = createContainer();
      container.style.backgroundColor = "#f0f0f0";
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

      expect(container.style.backgroundColor).toBe("rgb(240, 240, 240)");

      manager.destroy(instance.id);
    });
  });
});
