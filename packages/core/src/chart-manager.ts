import type {
  ChartData,
  ChartInstance,
  ChartName,
  ChartRenderer,
  MosqlimateConfig,
  RenderOptions,
  StatusChangeCallback,
} from "./types";
import { ApiClient } from "./api-client";
import { PlaceholderRenderer } from "./renderer";
import { createWatermarkElement, removeWatermarkElement } from "./watermark";
import {
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

let id_counter = 0;

function generateId(): string {
  return `mc-${Date.now()}-${++id_counter}`;
}

export class ChartManager {
  private instances = new Map<string, ChartInstance>();
  private api: ApiClient;
  private config: MosqlimateConfig;
  private statusListeners: StatusChangeCallback[] = [];

  constructor(config: MosqlimateConfig, sdk_key?: string) {
    this.config = config;
    this.api = new ApiClient(config.api_base, sdk_key);
  }

  setSdkKey(key: string): void {
    this.api.setSdkKey(key);
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

    try {
      const data = await this.api.fetchChart(options);
      instance.data = data;

      await renderer.render(container, data, {
        ...options,
        theme: options.theme ?? this.config.theme,
      });

      this.applyWatermark(container);

      instance.status = "ready";
    } catch (err) {
      instance.status = "error";
      instance.error = err instanceof Error ? err : new Error(String(err));
      this.renderError(container, instance.error);
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
    removeWatermarkElement(instance.container);
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
      "infodengue/total-cases": () => new TotalCasesChart(),
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

  private renderError(container: HTMLElement, error: Error): void {
    container.innerHTML = "";
    const el = document.createElement("div");
    el.setAttribute("role", "alert");
    el.style.cssText =
      "padding:16px;color:#dc3545;background:#f8d7da;border:1px solid #f5c2c7;border-radius:8px;font-family:system-ui,sans-serif;font-size:14px;";
    el.textContent = `Error loading chart: ${error.message}`;
    container.appendChild(el);
  }

  private applyWatermark(container: HTMLElement): void {
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    container.appendChild(createWatermarkElement());
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
