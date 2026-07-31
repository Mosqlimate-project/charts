import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import AccumulatedWaterfallChart from "../lib/AccumulatedWaterfallChart.svelte";
import AirChart from "../lib/AirChart.svelte";
import EggsDensityChart from "../lib/EggsDensityChart.svelte";
import MapChart from "../lib/MapChart.svelte";
import PositivityChart from "../lib/PositivityChart.svelte";
import RtChart from "../lib/RtChart.svelte";
import ScatterChart from "../lib/ScatterChart.svelte";
import TemperatureChart from "../lib/TemperatureChart.svelte";

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

const cases = [
  {
    name: "RtChart",
    component: RtChart,
    chart: "infodengue/rt",
    props: {
      disease: "dengue",
      geocode: 2300507,
      start: "2025-01-01",
      end: "2025-12-31",
    },
  },
  {
    name: "TemperatureChart",
    component: TemperatureChart,
    chart: "climate/temperature",
    props: { geocode: 2300507, start: "2025-01-01", end: "2025-12-31" },
  },
  {
    name: "AccumulatedWaterfallChart",
    component: AccumulatedWaterfallChart,
    chart: "climate/accumulated-waterfall",
    props: { geocode: 2300507, start: "2025-01-01", end: "2025-12-31" },
  },
  {
    name: "AirChart",
    component: AirChart,
    chart: "climate/umid-pressao-med",
    props: { geocode: 2300507, start: "2025-01-01", end: "2025-12-31" },
  },
  {
    name: "EggsDensityChart",
    component: EggsDensityChart,
    chart: "contaovos/eggs_density",
    props: { start: "2025-01-01", end: "2025-12-31", uf: "CE" },
  },
  {
    name: "PositivityChart",
    component: PositivityChart,
    chart: "contaovos/positivity",
    props: { start: "2025-01-01", end: "2025-12-31", uf: "CE" },
  },
  {
    name: "MapChart",
    component: MapChart,
    chart: "contaovos/map",
    props: { start: "2025-01-01", end: "2025-12-31" },
  },
  {
    name: "ScatterChart",
    component: ScatterChart,
    chart: "contaovos/map/scatter",
    props: { start: "2025-01-01", end: "2025-12-31" },
  },
];

describe("typed chart wrappers", () => {
  it.each(cases)(
    "$name renders $chart",
    async ({ component, chart, props }) => {
      mocks.render.mockResolvedValue(mockInstance("typed-1"));
      render(component, { props } as never);
      await flush();
      expect(mocks.render).toHaveBeenCalledWith(
        expect.objectContaining({ chart }),
      );
    },
  );
});
