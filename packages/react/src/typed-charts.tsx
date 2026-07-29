import type {
  Disease,
  UF,
  Theme,
  Language,
  ChartParams,
} from "@mosqlimate/charts";
import { MosqlimateChart } from "./chart";

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
export function RtChart({
  disease,
  geocode,
  start,
  end,
  ...rest
}: RtChartProps) {
  return (
    <MosqlimateChart
      chart="infodengue/rt"
      params={{ disease, geocode, start, end } as ChartParams}
      {...rest}
    />
  );
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
export function TemperatureChart({
  geocode,
  start,
  end,
  ...rest
}: TemperatureChartProps) {
  return (
    <MosqlimateChart
      chart="climate/temperature"
      params={{ geocode, start, end } as ChartParams}
      {...rest}
    />
  );
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
export function AccumulatedWaterfallChart({
  geocode,
  start,
  end,
  ...rest
}: AccumulatedWaterfallChartProps) {
  return (
    <MosqlimateChart
      chart="climate/accumulated-waterfall"
      params={{ geocode, start, end } as ChartParams}
      {...rest}
    />
  );
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
export function AirChart({ geocode, start, end, ...rest }: AirChartProps) {
  return (
    <MosqlimateChart
      chart="climate/umid-pressao-med"
      params={{ geocode, start, end } as ChartParams}
      {...rest}
    />
  );
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
export function EggsDensityChart({
  start,
  end,
  uf,
  geocode,
  ...rest
}: EggsDensityChartProps) {
  return (
    <MosqlimateChart
      chart="contaovos/eggs_density"
      params={{ start, end, uf, geocode } as ChartParams}
      {...rest}
    />
  );
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
export function PositivityChart({
  start,
  end,
  uf,
  ...rest
}: PositivityChartProps) {
  return (
    <MosqlimateChart
      chart="contaovos/positivity"
      params={{ start, end, uf } as ChartParams}
      {...rest}
    />
  );
}

export interface MapChartProps {
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}
export function MapChart({ start, end, ...rest }: MapChartProps) {
  return (
    <MosqlimateChart
      chart="contaovos/map"
      params={{ start, end } as ChartParams}
      {...rest}
    />
  );
}

export interface ScatterChartProps {
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}
export function ScatterChart({ start, end, ...rest }: ScatterChartProps) {
  return (
    <MosqlimateChart
      chart="contaovos/map/scatter"
      params={{ start, end } as ChartParams}
      {...rest}
    />
  );
}
