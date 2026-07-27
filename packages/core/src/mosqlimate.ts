import type {
  ChartName,
  MosqlimateConfig,
  RenderOptions,
  StatusChangeCallback,
} from "./types";
import { ChartManager } from "./chart-manager";
import { autoInit } from "./declarative";
import type { AutoInitOptions, AutoInitResult } from "./declarative";

const FALLBACK_API_BASE = "https://api.mosqlimate.org";

function getEnvApiBase(): string {
  try {
    return process.env.MOSQLIMATE_API_BASE ?? FALLBACK_API_BASE;
  } catch {
    return FALLBACK_API_BASE;
  }
}

const DEFAULT_CONFIG: MosqlimateConfig = {
  api_base: getEnvApiBase(),
  theme: "light",
};

let manager: ChartManager | null = null;

function getManager(): ChartManager {
  if (!manager) {
    manager = new ChartManager(DEFAULT_CONFIG);
  }
  return manager;
}

export interface MosqlimateStatic {
  version: string;
  configure(config: Partial<MosqlimateConfig> & { sdk_key?: string }): void;
  setSdkKey(key: string): void;
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
        ...DEFAULT_CONFIG,
        ...config,
      },
      config.sdk_key,
    );
  },

  setSdkKey(key: string): void {
    getManager().setSdkKey(key);
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
    return autoInit(options);
  },
};

declare const VERSION: string;
