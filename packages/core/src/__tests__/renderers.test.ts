import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PlaceholderRenderer } from "../renderer";
import { RtChart } from "../charts/infodengue";
import {
  TemperatureChart,
  AccumulatedWaterfallChart,
  AirChart,
} from "../charts/climate";
import { EggsDensityChart, PositivityChart } from "../charts/contaovos";

function makeContainer(): HTMLElement {
  const div = document.createElement("div");
  div.style.width = "600px";
  div.style.height = "400px";
  document.body.appendChild(div);
  return div;
}

function makeChartData(chart: string) {
  return {
    chart,
    category: chart.split("/")[0],
    data: [],
  } as const;
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
    await renderer.render(container, makeChartData("infodengue/rt"));
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
    expect(canvas?.width).toBe(600);
    expect(canvas?.height).toBe(400);
  });

  it("falls back to default dimensions when container has no size", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    await renderer.render(container, makeChartData("infodengue/rt"));
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
    await renderer.render(container, makeChartData("infodengue/rt"));
    expect(container.querySelector("canvas")).toBeTruthy();
    renderer.destroy();
    expect(container.querySelector("canvas")).toBeNull();
  });
});

describe("RtChart", () => {
  it("builds correct option structure", () => {
    const chart = new RtChart();
    const data = {
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
    const data = {
      chart: "infodengue/rt",
      category: "infodengue",
      data: [{ data_iniSE: "2024-01-07", Rt: 1.2 }],
    };
    const opt = chart.buildOption(data, "dark");
    expect(opt.series).toBeDefined();
  });

  it("uses Portuguese translations when lang is pt", () => {
    const chart = new TemperatureChart();
    const data = {
      chart: "climate/temperature",
      category: "climate",
      data: [{ date: "2024-01-01", temp_min: 18, temp_med: 24, temp_max: 30 }],
    };
    const opt = chart.buildOption(data, "light", "pt");
    expect(opt.legend?.data).toContain("Temp Máx");
    expect(opt.legend?.data).toContain("Temp Mín");
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
    const data = {
      chart: "climate/temperature",
      category: "climate",
      data: [{ date: "2024-01-01", temp_min: 18, temp_med: 24, temp_max: 30 }],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.xAxis).toBeDefined();
    expect(opt.yAxis).toBeDefined();
    expect(opt.series).toHaveLength(3);
  });
});

describe("AccumulatedWaterfallChart", () => {
  it("builds correct option structure", () => {
    const chart = new AccumulatedWaterfallChart();
    const data = {
      chart: "climate/accumulated-waterfall",
      category: "climate",
      data: [{ date: "2024-01-01", epiweek: 1, accumulated: 15.5 }],
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
    const data = {
      chart: "climate/umid-pressao-med",
      category: "climate",
      data: [{ date: "2024-01-01", umid_med: 65, pressao_med: 0.95 }],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.yAxis).toHaveLength(2);
    expect(opt.series).toHaveLength(2);
    expect(opt.series[0].yAxisIndex).toBe(0);
    expect(opt.series[1].yAxisIndex).toBe(1);
  });
});

describe("EggsDensityChart", () => {
  it("builds correct option structure", () => {
    const chart = new EggsDensityChart();
    const data = {
      chart: "contaovos/eggs_density",
      category: "contaovos",
      data: [{ date: "2024-01-01", eggs_density: 45.2 }],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.xAxis).toBeDefined();
    expect(opt.series).toBeDefined();
  });
});

describe("PositivityChart", () => {
  it("builds correct option structure", () => {
    const chart = new PositivityChart();
    const data = {
      chart: "contaovos/positivity",
      category: "contaovos",
      data: [{ date: "2024-01-01", positivity: 12.5 }],
    };
    const opt = chart.buildOption(data, "light");
    expect(opt.xAxis).toBeDefined();
    expect(opt.series).toBeDefined();
  });
});
