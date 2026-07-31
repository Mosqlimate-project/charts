import { Inject, Injectable, Optional } from "@angular/core";
import { Mosqlimate } from "@mosqlimate/charts";
import type {
  ChartData,
  ChartInstance,
  ChartName,
  ChartParams,
  RenderOptions,
} from "@mosqlimate/charts";
import { applyMosqlimateConfig, MOSQLIMATE_CONFIG } from "./config";
import type { MosqlimateConfig } from "./config";

@Injectable({ providedIn: "root" })
export class MosqlimateService {
  constructor(
    @Optional() @Inject(MOSQLIMATE_CONFIG) config?: MosqlimateConfig,
  ) {
    if (config) {
      void applyMosqlimateConfig(config);
    }
  }

  render<T extends ChartName>(
    options: RenderOptions<T>,
  ): Promise<ChartInstance> {
    return Mosqlimate.render(options);
  }

  destroy(id: string): void {
    Mosqlimate.destroy(id);
  }

  update(id: string, data: ChartData): void {
    Mosqlimate.update(id, data);
  }

  resize(id: string, width: number, height: number): void {
    Mosqlimate.resize(id, width, height);
  }
}

export type { ChartInstance, ChartName, ChartParams };
