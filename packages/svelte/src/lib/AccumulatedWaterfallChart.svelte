<script lang="ts">
  import type { ChartParams } from "@mosqlimate/charts";
  import MosqlimateChart from "./chart.svelte";
  import type { AccumulatedWaterfallChartProps } from "./types";

  let {
    geocode,
    start,
    end,
    theme,
    language,
    width,
    height,
  }: AccumulatedWaterfallChartProps = $props();

  const params = $derived({ geocode, start, end } as ChartParams);
</script>

<MosqlimateChart
  chart="climate/accumulated-waterfall"
  {params}
  {theme}
  {language}
  {width}
  {height}
/>
