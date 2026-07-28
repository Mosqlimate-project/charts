import type {
  ChartData,
  ChartInstance,
  ChartName,
  ChartRenderer,
  Language,
  MosqlimateConfig,
  RenderOptions,
  StatusChangeCallback,
  Theme,
} from "./types";
import { t } from "./i18n";
import { ApiClient } from "./api-client";
import { PlaceholderRenderer } from "./renderer";
import { applyWatermark, removeWatermark } from "./watermark";
import {
  RtChart,
  TemperatureChart,
  AccumulatedWaterfallChart,
  AirChart,
  EggsDensityChart,
  PositivityChart,
  MapChart,
  ScatterChart,
} from "./charts";

let id_counter = 0;

function generateId(): string {
  return `mc-${Date.now()}-${++id_counter}`;
}

export class ChartManager {
  private instances = new Map<string, ChartInstance>();
  private api: ApiClient;
  private config: MosqlimateConfig;
  private statusListeners: StatusChangeCallback[] = [];

  constructor(
    config: MosqlimateConfig,
    api_base: string,
    sdk_key?: string,
    api_key?: string,
  ) {
    this.config = config;
    this.api = new ApiClient(api_base, sdk_key, api_key);
  }

  setSdkKey(key: string): void {
    this.api.setSdkKey(key);
  }

  setApiKey(key: string): void {
    this.api.setApiKey(key);
  }

  setLanguage(lang: Language): void {
    this.config.language = lang;
  }

  async render<T extends ChartName>(
    options: RenderOptions<T>,
  ): Promise<ChartInstance> {
    const container = this.resolveContainer(options.target);
    const id = generateId();
    const renderer = this.createRenderer(options.chart);

    const instance: ChartInstance = {
      id,
      container,
      renderer,
      options,
      data: null,
      status: "loading",
      error: null,
    };

    this.instances.set(id, instance);
    this.emitStatus(instance);

    const lang = options.language ?? this.config.language ?? "en";

    try {
      const data = await this.api.fetchChart(options);
      instance.data = data;

      await renderer.render(container, data, {
        ...options,
        theme: options.theme ?? this.config.theme,
        language: lang,
      });

      this.applyWatermark(container, options.theme ?? this.config.theme);

      instance.status = "ready";
    } catch (err) {
      instance.status = "error";
      instance.error = err instanceof Error ? err : new Error(String(err));
      this.renderError(container, instance.error, lang);
    }

    this.emitStatus(instance);
    return instance;
  }

  update(id: string, data: ChartData): void {
    const instance = this.instances.get(id);
    if (!instance) return;
    instance.data = data;
    instance.renderer.update(data);
  }

  resize(id: string, width: number, height: number): void {
    const instance = this.instances.get(id);
    if (!instance) return;
    instance.renderer.resize(width, height);
  }

  destroy(id: string): void {
    const instance = this.instances.get(id);
    if (!instance) return;
    removeWatermark(instance.container);
    instance.renderer.destroy();
    this.instances.delete(id);
  }

  destroyAll(): void {
    for (const [id] of this.instances) {
      this.destroy(id);
    }
  }

  onStatusChange(callback: StatusChangeCallback): () => void {
    this.statusListeners.push(callback);
    return () => {
      this.statusListeners = this.statusListeners.filter(
        (cb) => cb !== callback,
      );
    };
  }

  getInstance(id: string): ChartInstance | undefined {
    return this.instances.get(id);
  }

  private resolveContainer(target: string | HTMLElement): HTMLElement {
    if (typeof target === "string") {
      const el = document.querySelector<HTMLElement>(target);
      if (!el) {
        throw new Error(`Container not found: ${target}`);
      }
      return el;
    }
    return target;
  }

  private createRenderer(chart: ChartName): ChartRenderer {
    const renderers: Record<ChartName, () => ChartRenderer> = {
      "infodengue/rt": () => new RtChart(),
      "climate/temperature": () => new TemperatureChart(),
      "climate/accumulated-waterfall": () => new AccumulatedWaterfallChart(),
      "climate/umid-pressao-med": () => new AirChart(),
      "contaovos/eggs_density": () => new EggsDensityChart(),
      "contaovos/positivity": () => new PositivityChart(),
      "contaovos/map": () => new MapChart(),
      "contaovos/map/scatter": () => new ScatterChart(),
    };
    return (renderers[chart] ?? (() => new PlaceholderRenderer()))();
  }

  private renderError(
    container: HTMLElement,
    error: Error,
    lang?: Language,
  ): void {
    container.innerHTML = "";
    const el = document.createElement("div");
    el.setAttribute("role", "alert");
    el.style.cssText =
      "padding:16px;color:#dc3545;background:#f8d7da;border:1px solid #f5c2c7;border-radius:8px;font-family:system-ui,sans-serif;font-size:14px;";
    el.textContent = `${t("error.loading", lang)}: ${error.message}`;
    container.appendChild(el);
  }

  private getThemeBg(theme: Theme): string {
    return theme === "dark" ? "#1a1a2e" : "#ffffff";
  }

  private applyWatermark(container: HTMLElement, theme: Theme): void {
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    applyWatermark(container, this.getThemeBg(theme));
  }

  private emitStatus(instance: ChartInstance): void {
    for (const cb of this.statusListeners) {
      cb({
        status: instance.status,
        chartId: instance.id,
        error: instance.error ?? undefined,
      });
    }
  }
}
