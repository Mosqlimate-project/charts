import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type PropType,
} from "vue";
import type {
  ChartInstance,
  ChartName,
  ChartParams,
  Language,
  Theme,
} from "@mosqlimate/charts";
import { Mosqlimate } from "@mosqlimate/charts";

export interface MosqlimateChartProps {
  chart: ChartName;
  params: ChartParams;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export const MosqlimateChart = defineComponent({
  name: "MosqlimateChart",
  props: {
    chart: { type: String as PropType<ChartName>, required: true },
    params: { type: Object as PropType<ChartParams>, required: true },
    theme: { type: String as PropType<Theme>, default: undefined },
    language: { type: String as PropType<Language>, default: undefined },
    width: { type: Number, default: undefined },
    height: { type: Number, default: undefined },
  },
  setup(props) {
    const containerRef = ref<HTMLDivElement | null>(null);
    const instanceRef = ref<ChartInstance | null>(null);
    const errorRef = ref<Error | null>(null);

    const renderChart = async (): Promise<void> => {
      const el = containerRef.value;
      if (!el) return;

      if (instanceRef.value) {
        Mosqlimate.destroy(instanceRef.value.id);
        instanceRef.value = null;
      }

      errorRef.value = null;
      try {
        const instance = await Mosqlimate.render({
          target: el,
          chart: props.chart,
          params: props.params,
          ...(props.theme ? { theme: props.theme } : {}),
          ...(props.language ? { language: props.language } : {}),
          ...(props.width !== undefined ? { width: props.width } : {}),
          ...(props.height !== undefined ? { height: props.height } : {}),
        });
        instanceRef.value = instance;
      } catch (err) {
        errorRef.value = err instanceof Error ? err : new Error(String(err));
      }
    };

    onMounted(renderChart);
    watch(
      () => [
        props.chart,
        props.params,
        props.theme,
        props.language,
        props.width,
        props.height,
      ],
      renderChart,
      { deep: true },
    );
    onBeforeUnmount(() => {
      if (instanceRef.value) {
        Mosqlimate.destroy(instanceRef.value.id);
        instanceRef.value = null;
      }
    });

    return () =>
      h(
        "div",
        {
          ref: containerRef,
          style: {
            width: props.width ? `${props.width}px` : "100%",
            height: props.height ? `${props.height}px` : "350px",
          },
        },
        errorRef.value
          ? h(
              "div",
              {
                role: "alert",
                style: {
                  padding: "16px",
                  color: "#dc3545",
                  background: "#f8d7da",
                  borderRadius: "8px",
                  fontSize: "14px",
                },
              },
              errorRef.value.message,
            )
          : undefined,
      );
  },
});
