import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type {
  ChartData,
  ChartName,
  ChartCategory,
  RenderOptions,
} from "../types";
import { PlaceholderRenderer } from "../renderer";
import { RtChart } from "../charts/infodengue";
import {
  TemperatureChart,
  AccumulatedWaterfallChart,
  AirChart,
} from "../charts/climate";
import { EggsDensityChart, PositivityChart } from "../charts/contaovos";
import { EpiscannerChart } from "../charts/episcanner";

vi.stubGlobal("VERSION", "0.0.0-test");

function makeContainer(): HTMLElement {
  const div = document.createElement("div");
  div.style.width = "600px";
  div.style.height = "400px";
  document.body.appendChild(div);
  return div;
}

function makeChartData<T extends ChartName>(chart: T): ChartData<T> {
  return {
    chart,
    category: chart.split("/")[0] as ChartCategory,
    data: [] as ChartData<T>["data"],
  };
}

describe("PlaceholderRenderer", () => {
  let renderer: PlaceholderRenderer;

  beforeEach(() => {
    renderer = new PlaceholderRenderer();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders canvas into container", async () => {
    const container = makeContainer();
    await renderer.render(
      container,
      makeChartData("infodengue/rt"),
      {} as RenderOptions,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
    expect(canvas?.width).toBe(600);
    expect(canvas?.height).toBe(400);
  });

  it("falls back to default dimensions when container has no size", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    await renderer.render(
      container,
      makeChartData("infodengue/rt"),
      {} as RenderOptions,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas?.width).toBe(600);
    expect(canvas?.height).toBe(400);
  });

  it("update does nothing when no container", () => {
    renderer.update(makeChartData("infodengue/rt"));
  });

  it("resize does nothing when no container", () => {
    renderer.resize(800, 600);
  });

  it("destroy does nothing when no container", () => {
    renderer.destroy();
  });

  it("destroy removes canvas and clears container", async () => {
    const container = makeContainer();
    await renderer.render(
      container,
      makeChartData("infodengue/rt"),
      {} as RenderOptions,
    );
    expect(container.querySelector("canvas")).toBeTruthy();
    renderer.destroy();
    expect(container.querySelector("canvas")).toBeNull();
  });
});

describe("RtChart", () => {
  it("builds correct option structure", () => {
    const chart = new RtChart();
    const data: ChartData<"infodengue/rt"> = {
      chart: "infodengue/rt",
      category: "infodengue",
      data: [
        { data_iniSE: "2024-01-07", Rt: 1.2 },
        { data_iniSE: "2024-01-14", Rt: 0.9 },
      ],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.xAxis).toBeDefined();
    expect(opt.yAxis).toBeDefined();
    expect(opt.series).toBeDefined();
    expect(opt.tooltip).toBeDefined();
  });

  it("builds dark theme option", () => {
    const chart = new RtChart();
    const data: ChartData<"infodengue/rt"> = {
      chart: "infodengue/rt",
      category: "infodengue",
      data: [{ data_iniSE: "2024-01-07", Rt: 1.2 }],
    };
    const opt = chart.buildOption(data, "dark");
    expect(opt.series).toBeDefined();
  });

  it("uses Portuguese translations when lang is pt", () => {
    const chart = new TemperatureChart();
    const data: ChartData<"climate/temperature"> = {
      chart: "climate/temperature",
      category: "climate",
      data: [
        {
          date: "2024-01-01",
          epiweek: 1,
          temp_min: 18,
          temp_med: 24,
          temp_max: 30,
        },
      ],
    };
    const opt = chart.buildOption(data, "light", "pt");
    const legend = opt.legend as { data: string[] } | undefined;
    expect(legend?.data).toContain("Temp Máx");
    expect(legend?.data).toContain("Temp Mín");
  });
});

import { t } from "../i18n";

describe("i18n t()", () => {
  it("falls back to English for unknown key", () => {
    const result = t("nonexistent.key", "pt");
    expect(result).toBe("nonexistent.key");
  });

  it("returns key when no lang and key is unknown", () => {
    const result = t("completely.missing");
    expect(result).toBe("completely.missing");
  });
});

describe("TemperatureChart", () => {
  it("builds correct option structure", () => {
    const chart = new TemperatureChart();
    const data: ChartData<"climate/temperature"> = {
      chart: "climate/temperature",
      category: "climate",
      data: [
        {
          date: "2024-01-01",
          epiweek: 1,
          temp_min: 18,
          temp_med: 24,
          temp_max: 30,
        },
      ],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.xAxis).toBeDefined();
    expect(opt.yAxis).toBeDefined();
    expect(opt.series).toBeDefined();
    expect((opt.series as unknown[]).length).toBe(3);
  });
});

describe("AccumulatedWaterfallChart", () => {
  it("builds correct option structure", () => {
    const chart = new AccumulatedWaterfallChart();
    const data: ChartData<"climate/accumulated-waterfall"> = {
      chart: "climate/accumulated-waterfall",
      category: "climate",
      data: [
        { date: "2024-01-01", epiweek: 1, precip_tot: 15.5, precip_med: 5.2 },
      ],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.xAxis).toBeDefined();
    expect(opt.yAxis).toBeDefined();
    expect(opt.series).toBeDefined();
  });
});

describe("AirChart", () => {
  it("builds correct option structure with dual y-axes", () => {
    const chart = new AirChart();
    const data: ChartData<"climate/umid-pressao-med"> = {
      chart: "climate/umid-pressao-med",
      category: "climate",
      data: [
        { date: "2024-01-01", epiweek: 1, umid_med: 65, pressao_med: 0.95 },
      ],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.yAxis).toHaveLength(2);
    const series = opt.series as unknown[];
    expect(series).toHaveLength(2);
    expect((series[0] as { yAxisIndex: number }).yAxisIndex).toBe(0);
    expect((series[1] as { yAxisIndex: number }).yAxisIndex).toBe(1);
  });
});

describe("EggsDensityChart", () => {
  it("builds correct option structure", () => {
    const chart = new EggsDensityChart();
    const data: ChartData<"contaovos/eggs_density"> = {
      chart: "contaovos/eggs_density",
      category: "contaovos",
      data: [{ epiweek: "202401", total_eggs: 45 }],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.xAxis).toBeDefined();
    expect(opt.series).toBeDefined();
  });
});

describe("PositivityChart", () => {
  it("builds correct option structure", () => {
    const chart = new PositivityChart();
    const data: ChartData<"contaovos/positivity"> = {
      chart: "contaovos/positivity",
      category: "contaovos",
      data: [{ name: "SP", positivity: 12.5 }],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.xAxis).toBeDefined();
    expect(opt.series).toBeDefined();
  });
});

describe("EpiscannerChart", () => {
  const geoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { geocode: "2304400", name: "Fortaleza" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-38.5, -3.8],
              [-38.4, -3.8],
              [-38.4, -3.7],
              [-38.5, -3.7],
            ],
          ],
        },
      },
    ],
  };

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => geoJson,
      }),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const row = {
    disease: "dengue",
    CID10: "A90",
    year: 2024,
    geocode: 2304400,
    muni_name: "Fortaleza",
    peak_week: 12,
    beta: 0.25,
    gamma: 0.2,
    R0: 1.5,
    total_cases: 1200,
    alpha: 0.01,
    sum_res: 0.02,
    ep_ini: "2024-01-01",
    ep_end: "2024-06-30",
    ep_dur: 26,
  };

  async function buildFor(
    metric: "R0" | "peak_week",
    data: ChartData<"episcanner">,
    lang?: "en" | "pt",
  ) {
    const chart = new EpiscannerChart();
    const container = makeContainer();
    await chart.render(container, data, {
      target: container,
      chart: "episcanner",
      params: { disease: "dengue", uf: "CE", year: 2024, metric },
    } as RenderOptions);
    return chart.buildOption(data, "light", lang);
  }

  const baseData: ChartData<"episcanner"> = {
    chart: "episcanner",
    category: "episcanner",
    data: [row],
  };

  it("builds a map option using the uf-scoped map", async () => {
    const opt = await buildFor("R0", baseData);
    const series = opt.series as unknown[];
    expect(series).toHaveLength(1);
    expect((series[0] as { type: string; map: string }).type).toBe("map");
    expect((series[0] as { map: string }).map).toBe("episcanner-ce");
    expect(opt.visualMap).toBeDefined();
  });

  it("maps data rows by geocode and uses the selected metric", async () => {
    const opt = await buildFor("peak_week", baseData);
    const series = opt.series as Array<{
      data: Array<{ name: string; value: number }>;
    }>;
    expect(series[0].data[0].name).toBe("2304400");
    expect(series[0].data[0].value).toBe(12);
  });

  it("sets visualMap min/max from metric values", async () => {
    const data: ChartData<"episcanner"> = {
      chart: "episcanner",
      category: "episcanner",
      data: [row, { ...row, geocode: 2303700, R0: 2.1 }],
    };
    const opt = await buildFor("R0", data);
    const vm = opt.visualMap as { min: number; max: number };
    expect(vm.min).toBe(1.5);
    expect(vm.max).toBe(2.1);
  });

  it("builds option structure with portuguese label", async () => {
    const opt = await buildFor("peak_week", baseData, "pt");
    expect(opt.tooltip).toBeDefined();
  });

  it("fetches and registers the uf-scoped map before rendering", async () => {
    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
    const chart = new EpiscannerChart();
    const container = makeContainer();
    await chart.render(container, baseData, {
      target: container,
      chart: "episcanner",
      params: { disease: "dengue", uf: "CE", year: 2024, metric: "R0" },
    } as RenderOptions);

    const echartsGlobal = (
      globalThis as unknown as {
        echarts: { registerMap: ReturnType<typeof vi.fn> };
      }
    ).echarts;

    expect(fetchMock).toHaveBeenCalledWith(
      "https://unpkg.com/@mosqlimate/charts@0.0.0-test/dist/maps/ce.json",
    );
    expect(echartsGlobal.registerMap).toHaveBeenCalledWith(
      "episcanner-ce",
      geoJson,
    );
  });
});
