<script lang="ts">
  import { untrack } from "svelte";
  import { Mosqlimate } from "@mosqlimate/charts";
  import type { ChartInstance, Language, Theme } from "@mosqlimate/charts";
  import type { MosqlimateChartProps } from "./types";

  let { chart, params, theme, language, width, height }: MosqlimateChartProps =
    $props();

  let container: HTMLDivElement;
  let instance: ChartInstance | null = $state(null);
  let error: Error | null = $state(null);

  const renderVersion = $derived(
    JSON.stringify({ chart, params, theme, language, width, height }),
  );

  async function renderChart(): Promise<void> {
    if (instance) {
      Mosqlimate.destroy(instance.id);
      instance = null;
    }

    error = null;
    try {
      instance = await Mosqlimate.render({
        target: container,
        chart,
        params,
        ...(theme ? { theme } : {}),
        ...(language ? { language } : {}),
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
      });
    } catch (err) {
      error = err instanceof Error ? err : new Error(String(err));
    }
  }

  $effect(() => {
    renderVersion;
    untrack(() => {
      void renderChart();
    });
  });

  $effect(() => {
    return () => {
      if (instance) {
        Mosqlimate.destroy(instance.id);
        instance = null;
      }
    };
  });
</script>

<div
  bind:this={container}
  style="width: {width ? `${width}px` : '100%'}; height: {height
    ? `${height}px`
    : '350px'};"
>
  {#if error}
    <div
      role="alert"
      style="padding: 16px; color: #dc3545; background: #f8d7da; border-radius: 8px; font-size: 14px;"
    >
      {error.message}
    </div>
  {/if}
</div>
