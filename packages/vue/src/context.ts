import {
  defineComponent,
  inject,
  onMounted,
  provide,
  watch,
  type InjectionKey,
  type PropType,
} from "vue";
import type { Language, Theme } from "@mosqlimate/charts";

export interface MosqlimateContextValue {
  api_key?: string;
  sdk_key?: string;
  theme?: Theme;
  language?: Language;
}

export const MosqlimateContextKey: InjectionKey<MosqlimateContextValue> =
  Symbol("mosqlimate");

async function applyConfig(config: MosqlimateContextValue): Promise<void> {
  const { Mosqlimate } = await import("@mosqlimate/charts");
  if (config.sdk_key) Mosqlimate.setSdkKey(config.sdk_key);
  if (config.api_key) Mosqlimate.setApiKey(config.api_key);
  if (config.theme || config.language)
    Mosqlimate.configure({
      ...(config.theme ? { theme: config.theme } : {}),
      ...(config.language ? { language: config.language } : {}),
    });
}

export const MosqlimateProvider = defineComponent({
  name: "MosqlimateProvider",
  props: {
    api_key: { type: String, default: undefined },
    sdk_key: { type: String, default: undefined },
    theme: { type: String as PropType<Theme>, default: undefined },
    language: { type: String as PropType<Language>, default: undefined },
  },
  setup(props, { slots }) {
    provide(MosqlimateContextKey, props);

    onMounted(() => {
      applyConfig(props);
    });
    watch(
      () => [props.api_key, props.sdk_key, props.theme, props.language],
      () => applyConfig(props),
    );

    return () => slots.default?.();
  },
});

export function useMosqlimate(): MosqlimateContextValue {
  return inject(MosqlimateContextKey, {});
}
