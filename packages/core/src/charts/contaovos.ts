import type { EChartsOption } from "echarts";
import type { ChartData, Language, Theme } from "../types";
import { EChartsRenderer } from "./base";
import { t } from "../i18n";

export class EggsDensityChart extends EChartsRenderer {
  protected buildOption(
    data: ChartData,
    theme: Theme,
    lang?: Language,
  ): EChartsOption {
    const rows = data.data as Array<{
      epiweek: string;
      total_eggs: number;
    }>;
    const c = this.axisColors(theme);

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        textStyle: { color: c.tooltipText },
      },
      grid: { left: 40, right: 20, bottom: 90, top: 70 },
      xAxis: {
        type: "category",
        data: rows.map((d) => d.epiweek),
        name: t("common.epiweek", lang),
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: { color: c.text },
        axisLabel: { rotate: 45, color: c.text },
        axisLine: { lineStyle: { color: c.line } },
      },
      yAxis: {
        type: "value",
        name: t("common.total_eggs", lang),
        nameTextStyle: { color: c.text },
        axisLabel: { color: c.text },
        splitLine: { lineStyle: { color: c.line } },
      },
      series: [
        {
          type: "line",
          data: rows.map((d) => d.total_eggs),
          smooth: true,
          symbol: "none",
          lineStyle: { color: "#81B863", width: 3 },
          itemStyle: { color: "#81B863" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(129, 184, 99, 0.3)" },
                { offset: 1, color: "rgba(129, 184, 99, 0.0)" },
              ],
            },
          },
        },
      ],
    };
  }
}

export class PositivityChart extends EChartsRenderer {
  protected buildOption(
    data: ChartData,
    theme: Theme,
    lang?: Language,
  ): EChartsOption {
    const rows = data.data as Array<{
      name: string;
      positivity: number;
    }>;
    const c = this.axisColors(theme);

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        textStyle: { color: c.tooltipText },
      },
      grid: { left: 40, right: 20, bottom: 90, top: 70 },
      xAxis: {
        type: "category",
        data: rows.map((d) => d.name),
        name: t("common.location", lang),
        nameLocation: "middle",
        nameGap: 60,
        nameTextStyle: { color: c.text },
        axisLabel: { rotate: 45, color: c.text },
        axisLine: { lineStyle: { color: c.line } },
      },
      yAxis: {
        type: "value",
        name: t("common.positivity", lang),
        nameTextStyle: { color: c.text },
        axisLabel: { color: c.text },
        splitLine: { lineStyle: { color: c.line } },
      },
      series: [
        {
          type: "bar",
          data: rows.map((d) => d.positivity),
          itemStyle: { color: "#A0E27B" },
        },
      ],
    };
  }
}

export class MapChart extends EChartsRenderer {
  private scatterData: Array<{
    name: string;
    latitude: number;
    longitude: number;
    trap_id: number;
    municipality: string;
  }> = [];

  setScatterData(
    data: Array<{
      name: string;
      latitude: number;
      longitude: number;
      trap_id: number;
      municipality: string;
    }>,
  ): void {
    this.scatterData = data;
  }

  protected buildOption(
    data: ChartData,
    theme: Theme,
    _lang?: Language,
  ): EChartsOption {
    const states = data.data as Array<{
      name: string;
      total_eggs: number;
      trap_count: number;
      municipality_count: number;
    }>;
    const c = this.axisColors(theme);

    const maxEggs = Math.max(...states.map((s) => s.total_eggs), 1);

    const scatterSeries =
      this.scatterData.length > 0
        ? [
            {
              type: "scatter" as const,
              coordinateSystem: "geo" as const,
              symbolSize: 7,
              data: this.scatterData.map((s) => ({
                name: s.name,
                value: [s.longitude, s.latitude] as [number, number],
                id: s.trap_id,
                municipality: s.municipality,
              })),
              zlevel: 1,
            },
          ]
        : [];

    return {
      visualMap: {
        min: 0,
        max: maxEggs,
        left: 20,
        calculable: true,
        inRange: { color: ["#CEF8FE", "#0F646B"] },
        textStyle: { color: c.text },
      },
      tooltip: {
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        textStyle: { color: c.tooltipText },
      },
      geo: {
        map: "brazil",
        roam: false,
        zoom: 1.08,
        center: [-55, -15] as [number, number],
        aspectScale: 1.1,
        itemStyle: {
          areaColor: this.isDark(theme) ? "#1f2937" : "#e0e0e0",
          borderColor: this.isDark(theme) ? "#4b5563" : "#333",
          borderWidth: 1,
        },
      },
      series: [
        {
          type: "map",
          map: "brazil",
          nameProperty: "sigla",
          roam: false,
          zoom: 1.08,
          center: [-55, -15] as [number, number],
          aspectScale: 1.1,
          itemStyle: {
            areaColor: this.isDark(theme) ? "#1f2937" : "#e0e0e0",
            borderColor: this.isDark(theme) ? "#4b5563" : "#333",
            borderWidth: 1,
          },
          data: states.map((s) => ({
            name: s.name,
            value: s.total_eggs,
            trap_count: s.trap_count,
            municipalities: s.municipality_count,
          })),
        },
        ...scatterSeries,
      ],
    };
  }
}

export class ScatterChart extends EChartsRenderer {
  protected buildOption(
    data: ChartData,
    theme: Theme,
    lang?: Language,
  ): EChartsOption {
    const rows = data.data as Array<{
      name: string;
      latitude: number;
      longitude: number;
      trap_id: number;
      municipality: string;
    }>;
    const c = this.axisColors(theme);

    return {
      tooltip: {
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        textStyle: { color: c.tooltipText },
      },
      xAxis: {
        type: "value",
        name: t("common.longitude", lang),
        nameTextStyle: { color: c.text },
        axisLabel: { color: c.text },
        splitLine: { lineStyle: { color: c.line } },
      },
      yAxis: {
        type: "value",
        name: t("common.latitude", lang),
        nameTextStyle: { color: c.text },
        axisLabel: { color: c.text },
        splitLine: { lineStyle: { color: c.line } },
      },
      series: [
        {
          type: "scatter",
          data: rows.map((d) => ({
            value: [d.longitude, d.latitude],
            name: `${d.municipality} (${d.name})`,
          })),
          symbolSize: 7,
          itemStyle: { color: "#0F646B" },
        },
      ],
    };
  }
}
