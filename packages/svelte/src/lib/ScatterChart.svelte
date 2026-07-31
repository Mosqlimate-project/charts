<script lang="ts">
  import type { ChartParams } from "@mosqlimate/charts";
  import MosqlimateChart from "./chart.svelte";
  import type { ScatterChartProps } from "./types";

  let { start, end, theme, language, width, height }: ScatterChartProps =
    $props();

  const params = $derived({ start, end } as ChartParams);
</script>

<MosqlimateChart
  chart="contaovos/map/scatter"
  {params}
  {theme}
  {language}
  {width}
  {height}
/>
