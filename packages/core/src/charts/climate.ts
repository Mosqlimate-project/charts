import type { EChartsOption } from "echarts";
import type { ChartData, Theme } from "../types";
import { EChartsRenderer } from "./base";

export class TemperatureChart extends EChartsRenderer {
  protected buildOption(data: ChartData, theme: Theme): EChartsOption {
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
        data: ["Max Temp", "Avg Temp", "Min Temp"],
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
        name: "Date",
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { fontSize: 12, fontWeight: "bold", color: c.text },
        axisLabel: { color: c.text, fontSize: 10 },
        axisLine: { lineStyle: { color: c.line } },
      },
      yAxis: {
        type: "value",
        name: "Temperature (°C)",
        nameTextStyle: { color: c.text },
        axisLabel: { color: c.text },
        splitLine: { lineStyle: { color: c.line } },
      },
      series: [
        {
          name: "Max Temp",
          type: "line",
          data: rows.map((d) => d.temp_max),
          lineStyle: { color: "#6A75B7" },
          itemStyle: { color: "#6A75B7" },
          showSymbol: false,
        },
        {
          name: "Avg Temp",
          type: "line",
          data: rows.map((d) => d.temp_med),
          lineStyle: { color: "#90BE10" },
          itemStyle: { color: "#90BE10" },
          showSymbol: false,
        },
        {
          name: "Min Temp",
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
  protected buildOption(data: ChartData, theme: Theme): EChartsOption {
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
        data: ["Precip Total", "Precip Avg"],
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
        name: "Date",
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { fontSize: 12, fontWeight: "bold", color: c.text },
        axisLabel: { fontSize: 10, color: c.text },
        axisLine: { lineStyle: { color: c.line } },
      },
      yAxis: {
        type: "value",
        name: "Precipitation (mm)",
        nameLocation: "middle",
        nameGap: 40,
        nameTextStyle: { fontSize: 12, fontWeight: "bold", color: c.text },
        splitNumber: 4,
        axisLabel: { color: c.text },
        splitLine: { lineStyle: { color: c.line } },
      },
      series: [
        {
          name: "Precip Avg",
          type: "bar",
          data: rows.map((d) => d.precip_med),
          barWidth: "100%",
          stack: "two",
          itemStyle: { color: "#2FDDEC" },
        },
        {
          name: "Precip Total",
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
  protected buildOption(data: ChartData, theme: Theme): EChartsOption {
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
        data: ["Humidity", "Pressure"],
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
        name: "Date",
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { fontSize: 12, fontWeight: "bold", color: c.text },
        axisLabel: { color: c.text, fontSize: 10 },
        axisLine: { lineStyle: { color: c.line } },
      },
      yAxis: [
        {
          type: "value",
          name: "Pressure (hPa)",
          position: "left",
          nameTextStyle: { color: c.text },
          axisLabel: { color: c.text },
          splitLine: { lineStyle: { color: c.line } },
        },
        {
          type: "value",
          name: "Humidity (%)",
          position: "right",
          nameTextStyle: { color: c.text },
          axisLabel: { color: c.text },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Pressure",
          type: "bar",
          data: rows.map((d) => d.pressao_med),
          yAxisIndex: 0,
          itemStyle: { color: "#8D9ECE" },
        },
        {
          name: "Humidity",
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
