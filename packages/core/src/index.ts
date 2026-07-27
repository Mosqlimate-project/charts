export { Mosqlimate } from "./mosqlimate";
export type { MosqlimateStatic } from "./mosqlimate";
export { ApiClient } from "./api-client";
export { ChartManager } from "./chart-manager";
export { PlaceholderRenderer } from "./renderer";
export { autoInit } from "./declarative";
export type { AutoInitOptions, AutoInitResult } from "./declarative";
export {
  MosqlimateChart,
  registerChartElement,
  isChartElementRegistered,
} from "./web-component";
export {
  EChartsRenderer,
  RtChart,
  TotalCasesChart,
  TemperatureChart,
  AccumulatedWaterfallChart,
  AirChart,
  EggsDensityChart,
  PositivityChart,
  MapChart,
  ScatterChart,
} from "./charts";
export type { EChartsOption } from "./charts";

export async function registerMap(geoJson: object): Promise<void> {
  const echarts = await import("echarts");
  echarts.registerMap(
    "brazil",
    geoJson as Parameters<typeof echarts.registerMap>[1],
  );
}

export type {
  Disease,
  UF,
  ChartCategory,
  InfodengueChart,
  ClimateChart,
  ContaOvosChart,
  ChartName,
  Theme,
  InfodengueParams,
  ClimateParams,
  ContaOvosParams,
  ContaOvosPositivityParams,
  ContaOvosMapParams,
  ChartParams,
  InfodengueRtRow,
  InfodengueTotalCases,
  ClimateTemperatureRow,
  ClimateWaterfallRow,
  ClimateHumidityPressureRow,
  ContaOvosEggsDensityRow,
  ContaOvosPositivityRow,
  ContaOvosMapStateRow,
  ContaOvosMapScatterRow,
  ChartDataMap,
  ChartData,
  RenderOptions,
  ChartRenderer,
  ChartInstance,
  MosqlimateConfig,
  StatusChangeCallback,
  StatusChangeEvent,
} from "./types";
