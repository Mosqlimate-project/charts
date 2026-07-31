<script lang="ts">
  import type { ChartParams } from "@mosqlimate/charts";
  import MosqlimateChart from "./chart.svelte";
  import type { AirChartProps } from "./types";

  let { geocode, start, end, theme, language, width, height }: AirChartProps =
    $props();

  const params = $derived({ geocode, start, end } as ChartParams);
</script>

<MosqlimateChart
  chart="climate/umid-pressao-med"
  {params}
  {theme}
  {language}
  {width}
  {height}
/>
