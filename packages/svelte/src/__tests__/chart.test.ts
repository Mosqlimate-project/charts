import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import MosqlimateChart from "../lib/chart.svelte";

const mocks = vi.hoisted(() => ({
  render: vi.fn(),
  destroy: vi.fn(),
}));

vi.mock("@mosqlimate/charts", () => ({
  Mosqlimate: {
    render: mocks.render,
    destroy: mocks.destroy,
  },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function mockInstance(id: string) {
  return {
    id,
    container: document.createElement("div"),
    renderer: {
      render: () => {},
      update: () => {},
      resize: () => {},
      destroy: () => {},
    },
    options: { target: "", chart: "infodengue/rt", params: {} },
    data: null,
    status: "ready",
    error: null,
  };
}

async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("MosqlimateChart", () => {
  it("renders a container and calls Mosqlimate.render on mount", async () => {
    mocks.render.mockResolvedValue(mockInstance("chart-1"));
    const { container } = render(MosqlimateChart, {
      props: {
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 2300507,
          start: "2025-01-01",
          end: "2025-12-31",
        },
      },
    });
    await flush();
    expect(container.querySelector("div")).not.toBeNull();
    expect(mocks.render).toHaveBeenCalledWith(
      expect.objectContaining({
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 2300507,
          start: "2025-01-01",
          end: "2025-12-31",
        },
      }),
    );
  });

  it("destroys the instance on unmount", async () => {
    mocks.render.mockResolvedValue(mockInstance("chart-2"));
    const { unmount } = render(MosqlimateChart, {
      props: {
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 2300507,
          start: "2025-01-01",
          end: "2025-12-31",
        },
      },
    });
    await flush();
    unmount();
    expect(mocks.destroy).toHaveBeenCalledWith("chart-2");
  });

  it("destroys the previous instance and re-renders when props change", async () => {
    mocks.render.mockResolvedValue(mockInstance("chart-1"));
    const { rerender } = render(MosqlimateChart, {
      props: {
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 2300507,
          start: "2025-01-01",
          end: "2025-12-31",
        },
      },
    });
    await flush();

    mocks.render.mockResolvedValue(mockInstance("chart-2"));
    await rerender({ theme: "dark" });
    await flush();

    expect(mocks.destroy).toHaveBeenCalledWith("chart-1");
    expect(mocks.render).toHaveBeenLastCalledWith(
      expect.objectContaining({ theme: "dark", chart: "infodengue/rt" }),
    );
  });

  it("passes optional theme, language, width and height to render", async () => {
    mocks.render.mockResolvedValue(mockInstance("chart-3"));
    const { container } = render(MosqlimateChart, {
      props: {
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 2300507,
          start: "2025-01-01",
          end: "2025-12-31",
        },
        theme: "dark",
        language: "pt",
        width: 600,
        height: 400,
      },
    });
    await flush();
    expect(mocks.render).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "dark",
        language: "pt",
        width: 600,
        height: 400,
      }),
    );
    const div = container.querySelector("div");
    expect(div?.style.width).toBe("600px");
    expect(div?.style.height).toBe("400px");
  });

  it("renders an error alert when render fails", async () => {
    mocks.render.mockRejectedValue(new Error("boom"));
    const { container } = render(MosqlimateChart, {
      props: {
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 2300507,
          start: "2025-01-01",
          end: "2025-12-31",
        },
      },
    });
    await flush();
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.textContent).toBe("boom");
  });

  it("renders a fallback message for non-Error failures", async () => {
    mocks.render.mockRejectedValue("boom-string");
    const { container } = render(MosqlimateChart, {
      props: {
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 2300507,
          start: "2025-01-01",
          end: "2025-12-31",
        },
      },
    });
    await flush();
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      "boom-string",
    );
  });
});
