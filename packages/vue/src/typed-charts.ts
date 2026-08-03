import { defineComponent, h, type PropType } from "vue";
import type {
  ChartParams,
  Disease,
  EpiscannerMetric,
  Language,
  Theme,
  UF,
} from "@mosqlimate/charts";
import { MosqlimateChart } from "./chart";

const commonProps = {
  theme: { type: String as PropType<Theme>, default: undefined },
  language: { type: String as PropType<Language>, default: undefined },
  width: { type: Number, default: undefined },
  height: { type: Number, default: undefined },
};

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
export const RtChart = defineComponent({
  name: "RtChart",
  props: {
    disease: { type: String as PropType<Disease>, required: true },
    geocode: { type: Number, required: true },
    start: { type: String, default: undefined },
    end: { type: String, default: undefined },
    ...commonProps,
  },
  setup(props) {
    return () =>
      h(MosqlimateChart, {
        chart: "infodengue/rt",
        params: {
          disease: props.disease,
          geocode: props.geocode,
          start: props.start,
          end: props.end,
        } as ChartParams,
        theme: props.theme,
        language: props.language,
        width: props.width,
        height: props.height,
      });
  },
});

export interface TemperatureChartProps {
  geocode: number;
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}
export const TemperatureChart = defineComponent({
  name: "TemperatureChart",
  props: {
    geocode: { type: Number, required: true },
    start: { type: String, default: undefined },
    end: { type: String, default: undefined },
    ...commonProps,
  },
  setup(props) {
    return () =>
      h(MosqlimateChart, {
        chart: "climate/temperature",
        params: {
          geocode: props.geocode,
          start: props.start,
          end: props.end,
        } as ChartParams,
        theme: props.theme,
        language: props.language,
        width: props.width,
        height: props.height,
      });
  },
});

export interface AccumulatedWaterfallChartProps {
  geocode: number;
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}
export const AccumulatedWaterfallChart = defineComponent({
  name: "AccumulatedWaterfallChart",
  props: {
    geocode: { type: Number, required: true },
    start: { type: String, default: undefined },
    end: { type: String, default: undefined },
    ...commonProps,
  },
  setup(props) {
    return () =>
      h(MosqlimateChart, {
        chart: "climate/accumulated-waterfall",
        params: {
          geocode: props.geocode,
          start: props.start,
          end: props.end,
        } as ChartParams,
        theme: props.theme,
        language: props.language,
        width: props.width,
        height: props.height,
      });
  },
});

export interface AirChartProps {
  geocode: number;
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}
export const AirChart = defineComponent({
  name: "AirChart",
  props: {
    geocode: { type: Number, required: true },
    start: { type: String, default: undefined },
    end: { type: String, default: undefined },
    ...commonProps,
  },
  setup(props) {
    return () =>
      h(MosqlimateChart, {
        chart: "climate/umid-pressao-med",
        params: {
          geocode: props.geocode,
          start: props.start,
          end: props.end,
        } as ChartParams,
        theme: props.theme,
        language: props.language,
        width: props.width,
        height: props.height,
      });
  },
});

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
export const EggsDensityChart = defineComponent({
  name: "EggsDensityChart",
  props: {
    start: { type: String, default: undefined },
    end: { type: String, default: undefined },
    uf: { type: String as PropType<UF>, default: undefined },
    geocode: { type: Number, default: undefined },
    ...commonProps,
  },
  setup(props) {
    return () =>
      h(MosqlimateChart, {
        chart: "contaovos/eggs_density",
        params: {
          start: props.start,
          end: props.end,
          uf: props.uf,
          geocode: props.geocode,
        } as ChartParams,
        theme: props.theme,
        language: props.language,
        width: props.width,
        height: props.height,
      });
  },
});

export interface PositivityChartProps {
  start?: string;
  end?: string;
  uf?: UF;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}
export const PositivityChart = defineComponent({
  name: "PositivityChart",
  props: {
    start: { type: String, default: undefined },
    end: { type: String, default: undefined },
    uf: { type: String as PropType<UF>, default: undefined },
    ...commonProps,
  },
  setup(props) {
    return () =>
      h(MosqlimateChart, {
        chart: "contaovos/positivity",
        params: {
          start: props.start,
          end: props.end,
          uf: props.uf,
        } as ChartParams,
        theme: props.theme,
        language: props.language,
        width: props.width,
        height: props.height,
      });
  },
});

export interface MapChartProps {
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}
export const MapChart = defineComponent({
  name: "MapChart",
  props: {
    start: { type: String, default: undefined },
    end: { type: String, default: undefined },
    ...commonProps,
  },
  setup(props) {
    return () =>
      h(MosqlimateChart, {
        chart: "contaovos/map",
        params: {
          start: props.start,
          end: props.end,
        } as ChartParams,
        theme: props.theme,
        language: props.language,
        width: props.width,
        height: props.height,
      });
  },
});

export interface ScatterChartProps {
  start?: string;
  end?: string;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}
export const ScatterChart = defineComponent({
  name: "ScatterChart",
  props: {
    start: { type: String, default: undefined },
    end: { type: String, default: undefined },
    ...commonProps,
  },
  setup(props) {
    return () =>
      h(MosqlimateChart, {
        chart: "contaovos/map/scatter",
        params: {
          start: props.start,
          end: props.end,
        } as ChartParams,
        theme: props.theme,
        language: props.language,
        width: props.width,
        height: props.height,
      });
  },
});

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
export const EpiscannerChart = defineComponent({
  name: "EpiscannerChart",
  props: {
    disease: { type: String as PropType<Disease>, required: true },
    uf: { type: String as PropType<UF>, required: true },
    year: { type: Number, required: true },
    metric: { type: String as PropType<EpiscannerMetric>, default: undefined },
    ...commonProps,
  },
  setup(props) {
    return () =>
      h(MosqlimateChart, {
        chart: "episcanner",
        params: {
          disease: props.disease,
          uf: props.uf,
          year: props.year,
          metric: props.metric,
        } as ChartParams,
        theme: props.theme,
        language: props.language,
        width: props.width,
        height: props.height,
      });
  },
});
