import type {
  ChartName,
  Language,
  MosqlimateConfig,
  RenderOptions,
  StatusChangeCallback,
  Theme,
} from "./types";
import { ChartManager } from "./chart-manager";
import { autoInit } from "./declarative";
import type { AutoInitOptions, AutoInitResult } from "./declarative";
import { registerChartElement } from "./web-component";

interface InternalConfig extends MosqlimateConfig {
  api_base: string;
}

let API_BASE = "https://api.mosqlimate.org";
try {
  API_BASE = process.env.MOSQLIMATE_API_BASE || API_BASE;
} catch {
  /* undefined */
}

const DEFAULT_CONFIG: InternalConfig = {
  api_base: API_BASE,
  theme: "light",
  language: "en",
};

let manager: ChartManager | null = null;

function getManager(): ChartManager {
  if (!manager) {
    manager = new ChartManager(DEFAULT_CONFIG, DEFAULT_CONFIG.api_base);
  }
  return manager;
}

export interface MosqlimateStatic {
  version: string;
  configure(config: {
    theme?: Theme;
    language?: Language;
    sdk_key?: string;
    api_key?: string;
  }): void;
  setSdkKey(key: string): void;
  setApiKey(key: string): void;
  setLanguage(lang: Language): void;
  render: ChartManager["render"];
  update: ChartManager["update"];
  resize: ChartManager["resize"];
  destroy: ChartManager["destroy"];
  destroyAll: ChartManager["destroyAll"];
  onStatusChange: ChartManager["onStatusChange"];
  autoInit(options?: AutoInitOptions): Promise<AutoInitResult>;
}

export const Mosqlimate: MosqlimateStatic = {
  version: VERSION,

  configure(config): void {
    manager = new ChartManager(
      {
        theme: config.theme ?? DEFAULT_CONFIG.theme,
        language: config.language ?? DEFAULT_CONFIG.language,
      },
      DEFAULT_CONFIG.api_base,
      config.sdk_key,
      config.api_key,
    );
  },

  setSdkKey(key: string): void {
    getManager().setSdkKey(key);
  },

  setApiKey(key: string): void {
    getManager().setApiKey(key);
  },

  setLanguage(lang: Language): void {
    getManager().setLanguage(lang);
  },

  render<T extends ChartName>(options: RenderOptions<T>) {
    return getManager().render(options);
  },

  update(id, data) {
    getManager().update(id, data);
  },

  resize(id, width, height) {
    getManager().resize(id, width, height);
  },

  destroy(id) {
    getManager().destroy(id);
  },

  destroyAll() {
    getManager().destroyAll();
  },

  onStatusChange(callback: StatusChangeCallback) {
    return getManager().onStatusChange(callback);
  },

  autoInit(options?: AutoInitOptions) {
    if (options?.sdk_key) Mosqlimate.setSdkKey(options.sdk_key);
    if (options?.api_key) Mosqlimate.setApiKey(options.api_key);
    if (options?.language) Mosqlimate.setLanguage(options.language);
    registerChartElement();
    return autoInit(options);
  },
};

declare const VERSION: string;
