import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockRender, mockDestroy } = vi.hoisted(() => ({
  mockRender: vi.fn(),
  mockDestroy: vi.fn(),
}));

vi.stubGlobal("VERSION", "0.0.0-test");

vi.mock("../mosqlimate", () => {
  return {
    Mosqlimate: {
      render: mockRender,
      destroy: mockDestroy,
      configure: vi.fn(),
      setSdkKey: vi.fn(),
      update: vi.fn(),
      resize: vi.fn(),
      destroyAll: vi.fn(),
      onStatusChange: vi.fn().mockReturnValue(() => {}),
      autoInit: vi.fn(),
    },
  };
});

import { MosqlimateChart, registerChartElement } from "../web-component";

function makeChartElement(attrs: Record<string, string> = {}): MosqlimateChart {
  const el = document.createElement("mosqlimate-chart") as MosqlimateChart;
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  return el;
}

describe("MosqlimateChart", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mockRender.mockReset();
    mockDestroy.mockReset();
    mockRender.mockResolvedValue({ id: "mc-wc-1", status: "ready" });
    registerChartElement();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("registration", () => {
    it("registers the custom element", () => {
      expect(customElements.get("mosqlimate-chart")).toBe(MosqlimateChart);
    });

    it("does not throw if registered twice", () => {
      expect(() => registerChartElement()).not.toThrow();
    });
  });

  describe("rendering", () => {
    it("renders when connected to DOM with required attrs", async () => {
      const el = makeChartElement({
        chart: "infodengue/rt",
        disease: "dengue",
        geocode: "3550308",
        start: "2024-01-01",
        end: "2024-01-31",
      });
      document.body.appendChild(el);

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledOnce();
      });

      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({
          chart: "infodengue/rt",
          params: {
            disease: "dengue",
            geocode: 3550308,
            start: "2024-01-01",
            end: "2024-01-31",
          },
        }),
      );
    });

    it("does not render without chart attribute", () => {
      const el = makeChartElement({
        disease: "dengue",
        geocode: "3550308",
        start: "2024-01-01",
        end: "2024-01-31",
      });
      document.body.appendChild(el);

      expect(mockRender).not.toHaveBeenCalled();
    });

    it("passes theme attribute", async () => {
      const el = makeChartElement({
        chart: "temperature",
        geocode: "3550308",
        start: "2024-01-01",
        end: "2024-01-31",
        theme: "dark",
      });
      document.body.appendChild(el);

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledOnce();
      });

      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({ theme: "dark" }),
      );
    });

    it("passes width and height as numbers", async () => {
      const el = makeChartElement({
        chart: "eggs-density",
        start: "2024-01-01",
        end: "2024-06-30",
        width: "800",
        height: "400",
      });
      document.body.appendChild(el);

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledOnce();
      });

      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({ width: 800, height: 400 }),
      );
    });

    it("passes api-base attribute", async () => {
      const el = makeChartElement({
        chart: "infodengue/rt",
        disease: "dengue",
        geocode: "3550308",
        start: "2024-01-01",
        end: "2024-01-31",
        "api-base": "https://custom.api",
      });
      document.body.appendChild(el);

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledOnce();
      });

      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({ api_base: "https://custom.api" }),
      );
    });

    it("passes uf attribute", async () => {
      const el = makeChartElement({
        chart: "positivity",
        start: "2024-01-01",
        end: "2024-06-30",
        uf: "SP",
      });
      document.body.appendChild(el);

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledOnce();
      });

      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ uf: "SP" }),
        }),
      );
    });
  });

  describe("shadow DOM", () => {
    it("attaches a shadow root", () => {
      const el = makeChartElement({ chart: "rt" });
      expect(el.shadowRoot).toBeTruthy();
      expect(el.shadowRoot?.mode).toBe("open");
    });

    it("creates a container div inside shadow root", () => {
      const el = makeChartElement({ chart: "rt" });
      const container = el.shadowRoot?.querySelector("div");
      expect(container).toBeTruthy();
    });
  });

  describe("lifecycle", () => {
    it("calls destroy on disconnect", async () => {
      const el = makeChartElement({
        chart: "infodengue/rt",
        disease: "dengue",
        geocode: "3550308",
        start: "2024-01-01",
        end: "2024-01-31",
      });
      document.body.appendChild(el);

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledOnce();
      });

      document.body.removeChild(el);

      expect(mockDestroy).toHaveBeenCalledWith("mc-wc-1");
    });

    it("re-renders when chart attribute changes", async () => {
      const el = makeChartElement({
        chart: "infodengue/rt",
        disease: "dengue",
        geocode: "3550308",
        start: "2024-01-01",
        end: "2024-01-31",
      });
      document.body.appendChild(el);

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledOnce();
      });

      mockRender.mockResolvedValue({ id: "mc-wc-2", status: "ready" });
      el.setAttribute("chart", "temperature");

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledTimes(2);
      });

      expect(mockDestroy).toHaveBeenCalledWith("mc-wc-1");
    });

    it("does not re-render if attribute value does not change", async () => {
      const el = makeChartElement({
        chart: "infodengue/rt",
        disease: "dengue",
        geocode: "3550308",
        start: "2024-01-01",
        end: "2024-01-31",
      });
      document.body.appendChild(el);

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledOnce();
      });

      el.setAttribute("chart", "rt");

      await new Promise((r) => setTimeout(r, 50));

      expect(mockRender).toHaveBeenCalledOnce();
    });

    it("cleans up when chart attr is removed", async () => {
      const el = makeChartElement({
        chart: "infodengue/rt",
        disease: "dengue",
        geocode: "3550308",
        start: "2024-01-01",
        end: "2024-01-31",
      });
      document.body.appendChild(el);

      await vi.waitFor(() => {
        expect(mockRender).toHaveBeenCalledOnce();
      });

      el.removeAttribute("chart");

      expect(mockDestroy).toHaveBeenCalledWith("mc-wc-1");
    });
  });
});
