import type { ChartName, Language, RenderOptions, Theme } from "./types";
import { Mosqlimate } from "./mosqlimate";
import { registerChartElement } from "./web-component";

const VALID_CHARTS: readonly string[] = [
  "infodengue/rt",
  "climate/temperature",
  "climate/accumulated-waterfall",
  "climate/umid-pressao-med",
  "contaovos/eggs_density",
  "contaovos/positivity",
  "contaovos/map",
  "contaovos/map/scatter",
  "episcanner",
];

const VALID_THEMES: readonly string[] = [
  "light",
  "dark",
  "minimal",
  "publication",
  "dashboard",
];

const SELECTOR = "[data-chart]";

interface ContainerStyle {
  background?: string;
  border?: string;
  borderRadius?: string;
  padding?: string;
  fontFamily?: string;
}

function parseNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseContainerStyle(dataset: DOMStringMap): ContainerStyle {
  const style: ContainerStyle = {};
  const map: Record<string, keyof ContainerStyle> = {
    background: "background",
    border: "border",
    borderRadius: "borderRadius",
    padding: "padding",
    fontFamily: "fontFamily",
  };

  for (const [attr, prop] of Object.entries(map)) {
    const val = dataset[attr];
    if (val !== undefined && val !== "") {
      style[prop] = val;
    }
  }

  return style;
}

function applyContainerStyle(el: HTMLElement, style: ContainerStyle): void {
  for (const [prop, val] of Object.entries(style)) {
    (el.style as unknown as Record<string, string>)[prop] = val;
  }
}

export interface AutoInitOptions {
  root?: ParentNode;
  sdk_key?: string;
  api_key?: string;
  language?: Language;
}

export interface AutoInitResult {
  rendered: number;
  errors: Array<{ element: HTMLElement; error: Error }>;
}

export async function autoInit(
  options?: AutoInitOptions,
): Promise<AutoInitResult> {
  registerChartElement();

  const root = options?.root ?? document;
  const elements = root.querySelectorAll<HTMLElement>(SELECTOR);

  if (options?.sdk_key) {
    Mosqlimate.setSdkKey(options.sdk_key);
  }
  if (options?.api_key) {
    Mosqlimate.setApiKey(options.api_key);
  }
  if (options?.language) {
    Mosqlimate.setLanguage(options.language);
  }

  const result: AutoInitResult = { rendered: 0, errors: [] };

  const tasks: Promise<void>[] = [];

  for (const el of elements) {
    const ds = el.dataset;
    const chart = ds.chart;

    if (!chart || !VALID_CHARTS.includes(chart)) {
      result.errors.push({
        element: el,
        error: new Error(`Invalid or missing data-chart: "${chart}"`),
      });
      continue;
    }

    const width = parseNumber(ds.width);
    const height = parseNumber(ds.height);
    const geocode = parseNumber(ds.geocode);
    const year = parseNumber(ds.year);
    const theme = ds.theme as Theme | undefined;
    const language = (ds.language as Language | undefined) ?? options?.language;

    if (theme && !VALID_THEMES.includes(theme)) {
      result.errors.push({
        element: el,
        error: new Error(`Invalid data-theme: "${theme}"`),
      });
      continue;
    }

    const params: Record<string, string | number> = {};
    if (ds.disease !== undefined) params.disease = ds.disease;
    if (geocode !== undefined) params.geocode = geocode;
    if (ds.start !== undefined) params.start = ds.start;
    if (ds.end !== undefined) params.end = ds.end;
    if (ds.uf !== undefined) params.uf = ds.uf;
    if (year !== undefined) params.year = year;
    if (ds.metric !== undefined) params.metric = ds.metric;

    const containerStyle = parseContainerStyle(ds);
    applyContainerStyle(el, containerStyle);

    const renderOpts: RenderOptions = {
      target: el,
      chart: chart as ChartName,
      params: params as unknown as RenderOptions["params"],
      ...(theme && { theme }),
      ...(language && { language }),
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
    };

    tasks.push(
      Mosqlimate.render(renderOpts)
        .then(() => {
          result.rendered++;
        })
        .catch((err) => {
          result.errors.push({
            element: el,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }),
    );
  }

  await Promise.allSettled(tasks);
  return result;
}
