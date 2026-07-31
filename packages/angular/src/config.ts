import {
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
  type EnvironmentProviders,
} from "@angular/core";
import type { Language, Theme } from "@mosqlimate/charts";

export interface MosqlimateConfig {
  api_key?: string;
  sdk_key?: string;
  theme?: Theme;
  language?: Language;
}

export const MOSQLIMATE_CONFIG = new InjectionToken<MosqlimateConfig>(
  "mosqlimate global configuration",
);

export async function applyMosqlimateConfig(
  config: MosqlimateConfig,
): Promise<void> {
  const { Mosqlimate } = await import("@mosqlimate/charts");
  if (config.sdk_key) Mosqlimate.setSdkKey(config.sdk_key);
  if (config.api_key) Mosqlimate.setApiKey(config.api_key);
  if (config.theme || config.language) {
    Mosqlimate.configure({
      ...(config.theme ? { theme: config.theme } : {}),
      ...(config.language ? { language: config.language } : {}),
    });
  }
}

export function provideMosqlimate(
  config: MosqlimateConfig = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MOSQLIMATE_CONFIG, useValue: config },
    provideAppInitializer(() => applyMosqlimateConfig(config)),
  ]);
}
