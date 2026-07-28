import type { EChartsOption } from "echarts";
import type { ChartData, Language, Theme } from "../types";
import { EChartsRenderer } from "./base";
import { t } from "../i18n";

export class TemperatureChart extends EChartsRenderer {
  buildOption(data: ChartData, theme: Theme, lang?: Language): EChartsOption {
    const rows = data.data as Array<{
      date: string;
      temp_min: number;
      temp_med: number;
      temp_max: number;
    }>;
    const c = this.axisColors(theme);

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        textStyle: { color: c.tooltipText },
      },
      legend: {
        data: [
          t("temperature.max", lang),
          t("temperature.avg", lang),
          t("temperature.min", lang),
        ],
        top: 35,
        textStyle: { color: c.titleText },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: 60,
        top: 100,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: rows.map((d) => d.date.split(" ")[0]),
        name: t("common.date", lang),
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { fontSize: 12, fontWeight: "bold", color: c.text },
        axisLabel: { color: c.text, fontSize: 10 },
        axisLine: { lineStyle: { color: c.line } },
      },
      yAxis: {
        type: "value",
        name: t("common.temperature", lang),
        nameTextStyle: { color: c.text },
        axisLabel: { color: c.text },
        splitLine: { lineStyle: { color: c.line } },
      },
      series: [
        {
          name: t("temperature.max", lang),
          type: "line",
          data: rows.map((d) => d.temp_max),
          lineStyle: { color: "#6A75B7" },
          itemStyle: { color: "#6A75B7" },
          showSymbol: false,
        },
        {
          name: t("temperature.avg", lang),
          type: "line",
          data: rows.map((d) => d.temp_med),
          lineStyle: { color: "#90BE10" },
          itemStyle: { color: "#90BE10" },
          showSymbol: false,
        },
        {
          name: t("temperature.min", lang),
          type: "line",
          data: rows.map((d) => d.temp_min),
          lineStyle: { color: "#41BAC5" },
          itemStyle: { color: "#41BAC5" },
          showSymbol: false,
        },
      ],
      dataZoom: [
        { type: "inside", throttle: 50 },
        {
          type: "slider",
          show: true,
          bottom: 7,
          height: 10,
          borderColor: "transparent",
          backgroundColor: c.tooltipBg,
          fillerColor: this.isDark(theme)
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
          textStyle: { color: c.text },
        },
      ],
    };
  }
}

export class AccumulatedWaterfallChart extends EChartsRenderer {
  buildOption(data: ChartData, theme: Theme, lang?: Language): EChartsOption {
    const rows = data.data as Array<{
      date: string;
      precip_tot: number;
      precip_med: number;
    }>;
    const c = this.axisColors(theme);

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        textStyle: { color: c.tooltipText },
      },
      legend: {
        data: [
          t("accumulated.precip_total", lang),
          t("accumulated.precip_avg", lang),
        ],
        top: 40,
        textStyle: { color: c.titleText },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: 60,
        top: 80,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: rows.map((d) => d.date.split(" ")[0]),
        name: t("common.date", lang),
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { fontSize: 12, fontWeight: "bold", color: c.text },
        axisLabel: { fontSize: 10, color: c.text },
        axisLine: { lineStyle: { color: c.line } },
      },
      yAxis: {
        type: "value",
        name: t("common.precipitation", lang),
        nameLocation: "middle",
        nameGap: 40,
        nameTextStyle: { fontSize: 12, fontWeight: "bold", color: c.text },
        splitNumber: 4,
        axisLabel: { color: c.text },
        splitLine: { lineStyle: { color: c.line } },
      },
      series: [
        {
          name: t("accumulated.precip_avg", lang),
          type: "bar",
          data: rows.map((d) => d.precip_med),
          barWidth: "100%",
          stack: "two",
          itemStyle: { color: "#2FDDEC" },
        },
        {
          name: t("accumulated.precip_total", lang),
          type: "bar",
          data: rows.map((d) => d.precip_tot),
          barWidth: "100%",
          stack: "two",
          itemStyle: { color: "#0F646B" },
        },
      ],
      dataZoom: [
        { type: "inside", throttle: 50 },
        {
          type: "slider",
          show: true,
          bottom: 5,
          height: 15,
          borderColor: "transparent",
          backgroundColor: c.tooltipBg,
          fillerColor: this.isDark(theme)
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
          textStyle: { color: c.text },
        },
      ],
    };
  }
}

export class AirChart extends EChartsRenderer {
  buildOption(data: ChartData, theme: Theme, lang?: Language): EChartsOption {
    const rows = data.data as Array<{
      date: string;
      umid_med: number;
      pressao_med: number;
    }>;
    const c = this.axisColors(theme);

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        textStyle: { color: c.tooltipText },
      },
      legend: {
        data: [t("air.humidity", lang), t("air.pressure", lang)],
        top: 35,
        textStyle: { color: c.titleText },
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: 60,
        top: 100,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: rows.map((d) => d.date.split(" ")[0]),
        name: t("common.date", lang),
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { fontSize: 12, fontWeight: "bold", color: c.text },
        axisLabel: { color: c.text, fontSize: 10 },
        axisLine: { lineStyle: { color: c.line } },
      },
      yAxis: [
        {
          type: "value",
          name: t("air.pressure_axis", lang),
          position: "left",
          min: "dataMin",
          max: (value: { max: number }) => value.max + 0.02,
          nameTextStyle: { color: c.text },
          axisLabel: { color: c.text },
          splitLine: { lineStyle: { color: c.line } },
        },
        {
          type: "value",
          name: t("air.humidity_axis", lang),
          position: "right",
          nameTextStyle: { color: c.text },
          axisLabel: { color: c.text },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: t("air.pressure", lang),
          type: "bar",
          data: rows.map((d) => d.pressao_med),
          yAxisIndex: 0,
          itemStyle: { color: "#8D9ECE" },
        },
        {
          name: t("air.humidity", lang),
          type: "line",
          data: rows.map((d) => d.umid_med),
          yAxisIndex: 1,
          lineStyle: { color: "#81B863" },
          itemStyle: { color: "#81B863" },
          showSymbol: false,
        },
      ],
      dataZoom: [
        { type: "inside", throttle: 50 },
        {
          type: "slider",
          show: true,
          bottom: 7,
          height: 10,
          borderColor: "transparent",
          backgroundColor: c.tooltipBg,
          fillerColor: this.isDark(theme)
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
          textStyle: { color: c.text },
        },
      ],
    };
  }
}
