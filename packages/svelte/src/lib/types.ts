import type {
  ChartName,
  ChartParams,
  Disease,
  EpiscannerMetric,
  Language,
  Theme,
  UF,
} from "@mosqlimate/charts";

export interface MosqlimateContextValue {
  api_key?: string;
  sdk_key?: string;
  theme?: Theme;
  language?: Language;
}

export interface MosqlimateChartProps {
  chart: ChartName;
  params: ChartParams;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export interface RtChartProps {
  disease: Disease;
  geocode: number;
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export interface TemperatureChartProps {
  geocode: number;
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export interface AccumulatedWaterfallChartProps {
  geocode: number;
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export interface AirChartProps {
  geocode: number;
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export interface EggsDensityChartProps {
  start?: string;
  end?: string;
  uf?: UF;
  geocode?: number;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export interface PositivityChartProps {
  start?: string;
  end?: string;
  uf?: UF;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export interface MapChartProps {
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export interface ScatterChartProps {
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export interface EpiscannerChartProps {
  disease: Disease;
  uf: UF;
  year: number;
  metric?: EpiscannerMetric;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}
