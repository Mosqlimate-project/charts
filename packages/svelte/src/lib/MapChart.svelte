<script lang="ts">
  import type { ChartParams } from "@mosqlimate/charts";
  import MosqlimateChart from "./chart.svelte";
  import type { MapChartProps } from "./types";

  let { start, end, theme, language, width, height }: MapChartProps = $props();

  const params = $derived({ start, end } as ChartParams);
</script>

<MosqlimateChart
  chart="contaovos/map"
  {params}
  {theme}
  {language}
  {width}
  {height}
/>
