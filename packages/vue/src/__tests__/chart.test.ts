import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { MosqlimateChart } from "../chart";

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

describe("MosqlimateChart", () => {
  it("renders a container and calls Mosqlimate.render on mount", () => {
    mocks.render.mockResolvedValue(mockInstance("chart-1"));
    const wrapper = mount(MosqlimateChart, {
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
    expect(wrapper.find("div").exists()).toBe(true);
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
    const wrapper = mount(MosqlimateChart, {
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
    await flushPromises();
    wrapper.unmount();
    expect(mocks.destroy).toHaveBeenCalledWith("chart-2");
  });

  it("renders an error alert when render fails", async () => {
    mocks.render.mockRejectedValue(new Error("boom"));
    const wrapper = mount(MosqlimateChart, {
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
    await flushPromises();
    expect(wrapper.find('[role="alert"]').text()).toBe("boom");
  });
});
