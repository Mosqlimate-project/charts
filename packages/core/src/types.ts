export type Disease = "dengue" | "deng" | "chik" | "chikungunya" | "zika";

export type UF =
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO"
  | "DF";

export type ChartCategory = "infodengue" | "climate" | "contaovos";

export type InfodengueChart = "infodengue/rt";

export type ClimateChart =
  | "climate/temperature"
  | "climate/accumulated-waterfall"
  | "climate/umid-pressao-med";

export type ContaOvosChart =
  | "contaovos/eggs_density"
  | "contaovos/positivity"
  | "contaovos/map"
  | "contaovos/map/scatter";

export type ChartName = InfodengueChart | ClimateChart | ContaOvosChart;

export type Theme = "light" | "dark" | "minimal" | "publication" | "dashboard";
export type Language = "en" | "pt";

// --- Input params ---

export interface InfodengueParams {
  disease: Disease;
  geocode: number;
  start: string;
  end: string;
}

export interface ClimateParams {
  geocode: number;
  start: string;
  end: string;
}

export interface ContaOvosParams {
  start: string;
  end: string;
  uf?: UF;
  geocode?: number;
}

export interface ContaOvosPositivityParams {
  start: string;
  end: string;
  uf?: UF;
}

export interface ContaOvosMapParams {
  start: string;
  end: string;
}

export type ChartParams =
  | InfodengueParams
  | ClimateParams
  | ContaOvosParams
  | ContaOvosPositivityParams
  | ContaOvosMapParams;

// --- Output data ---

export interface InfodengueRtRow {
  data_iniSE: string;
  Rt: number | null;
}

export interface ClimateTemperatureRow {
  date: string;
  epiweek: number;
  temp_min: number;
  temp_med: number;
  temp_max: number;
}

export interface ClimateWaterfallRow {
  date: string;
  epiweek: number;
  precip_tot: number;
  precip_med: number;
}

export interface ClimateHumidityPressureRow {
  date: string;
  epiweek: number;
  umid_med: number;
  pressao_med: number;
}

export interface ContaOvosEggsDensityRow {
  epiweek: string;
  total_eggs: number;
}

export interface ContaOvosPositivityRow {
  name: string;
  positivity: number;
}

export interface ContaOvosMapStateRow {
  name: string;
  total_eggs: number;
  trap_count: number;
  municipality_count: number;
}

export interface ContaOvosMapScatterRow {
  name: string;
  latitude: number;
  longitude: number;
  trap_id: number;
  municipality: string;
}

// --- Chart data wrapper ---

export type ChartDataMap = {
  "infodengue/rt": InfodengueRtRow[];
  "climate/temperature": ClimateTemperatureRow[];
  "climate/accumulated-waterfall": ClimateWaterfallRow[];
  "climate/umid-pressao-med": ClimateHumidityPressureRow[];
  "contaovos/eggs_density": ContaOvosEggsDensityRow[];
  "contaovos/positivity": ContaOvosPositivityRow[];
  "contaovos/map": ContaOvosMapStateRow[];
  "contaovos/map/scatter": ContaOvosMapScatterRow[];
};

export interface ChartData<T extends ChartName = ChartName> {
  chart: T;
  category: ChartCategory;
  data: ChartDataMap[T];
}

// --- Render options ---

export interface RenderOptions<T extends ChartName = ChartName> {
  target: string | HTMLElement;
  chart: T;
  params: ChartParams;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

// --- Renderer contract ---

export interface ChartRenderer {
  render(
    container: HTMLElement,
    data: ChartData,
    options: RenderOptions,
  ): void | Promise<void>;
  update(data: ChartData): void;
  resize(width: number, height: number): void;
  destroy(): void;
}

// --- Instance ---

export interface ChartInstance {
  id: string;
  container: HTMLElement;
  renderer: ChartRenderer;
  options: RenderOptions;
  data: ChartData | null;
  status: "loading" | "ready" | "error";
  error: Error | null;
}

// --- Config ---

export interface MosqlimateConfig {
  theme: Theme;
  language?: Language;
}

export type StatusChangeCallback = (event: StatusChangeEvent) => void;

export interface StatusChangeEvent {
  status: "loading" | "ready" | "error";
  chartId: string;
  error?: Error;
}
