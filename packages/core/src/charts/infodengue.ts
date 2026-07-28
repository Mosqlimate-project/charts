import type { EChartsOption } from "echarts";
import type { ChartData, Theme } from "../types";
import { EChartsRenderer } from "./base";

export class RtChart extends EChartsRenderer {
  protected buildOption(data: ChartData, theme: Theme): EChartsOption {
    const rows = data.data as Array<{ data_iniSE: string; Rt: number | null }>;
    const c = this.axisColors(theme);

    const sorted = [...rows].sort(
      (a, b) =>
        new Date(a.data_iniSE).getTime() - new Date(b.data_iniSE).getTime(),
    );

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        textStyle: { color: c.tooltipText },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: 50,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: sorted.map((d) => d.data_iniSE),
        axisLabel: {
          formatter: (v: string) => v.split("T")[0],
          color: c.text,
        },
        axisLine: { lineStyle: { color: c.line } },
      },
      yAxis: {
        type: "value",
        name: "Rt",
        min: 0,
        nameTextStyle: { color: c.text },
        axisLabel: { color: c.text },
        splitLine: {
          show: true,
          lineStyle: { type: "dashed", color: c.line },
        },
      },
      visualMap: {
        show: false,
        pieces: [
          { gt: 0, lte: 1, color: "#22c55e" },
          { gt: 1, color: "#ef4444" },
        ],
        outOfRange: { color: "#999" },
      },
      series: [
        {
          name: "Rt",
          type: "line",
          data: sorted.map((d) => d.Rt),
          smooth: true,
          showSymbol: false,
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: {
              color: c.text,
              type: "dashed",
              width: 1,
            },
            label: { position: "end", formatter: "Threshold", color: c.text },
            data: [{ yAxis: 1.0 }],
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(150, 150, 150, 0.2)" },
                { offset: 1, color: "rgba(150, 150, 150, 0.0)" },
              ],
            },
          },
        },
      ],
    };
  }
}
