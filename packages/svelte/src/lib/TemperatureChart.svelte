<script lang="ts">
  import type { ChartParams } from "@mosqlimate/charts";
  import MosqlimateChart from "./chart.svelte";
  import type { TemperatureChartProps } from "./types";

  let {
    geocode,
    start,
    end,
    theme,
    language,
    width,
    height,
  }: TemperatureChartProps = $props();

  const params = $derived({ geocode, start, end } as ChartParams);
</script>

<MosqlimateChart
  chart="climate/temperature"
  {params}
  {theme}
  {language}
  {width}
  {height}
/>
