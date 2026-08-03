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
  TemperatureChart,
  AccumulatedWaterfallChart,
  AirChart,
  EggsDensityChart,
  PositivityChart,
  MapChart,
  ScatterChart,
  EpiscannerChart,
} from "./charts";
export type { EChartsOption } from "./charts";
export { DEFAULT_MAPS_BASE } from "./maps";

import * as echarts from "echarts";

export function registerMap(geoJson: object, name = "brazil"): void {
  echarts.registerMap(
    name,
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
  Language,
  EpiscannerMetric,
  InfodengueParams,
  ClimateParams,
  ContaOvosParams,
  ContaOvosPositivityParams,
  ContaOvosMapParams,
  EpiscannerParams,
  ChartParams,
  InfodengueRtRow,
  ClimateTemperatureRow,
  ClimateWaterfallRow,
  ClimateHumidityPressureRow,
  ContaOvosEggsDensityRow,
  ContaOvosPositivityRow,
  ContaOvosMapStateRow,
  ContaOvosMapScatterRow,
  EpiscannerRow,
  ChartDataMap,
  ChartData,
  RenderOptions,
  ChartRenderer,
  ChartInstance,
  MosqlimateConfig,
  StatusChangeCallback,
  StatusChangeEvent,
} from "./types";
