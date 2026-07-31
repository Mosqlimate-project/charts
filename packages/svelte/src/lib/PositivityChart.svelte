<script lang="ts">
  import type { ChartParams } from "@mosqlimate/charts";
  import MosqlimateChart from "./chart.svelte";
  import type { PositivityChartProps } from "./types";

  let { start, end, uf, theme, language, width, height }: PositivityChartProps =
    $props();

  const params = $derived({ start, end, uf } as ChartParams);
</script>

<MosqlimateChart
  chart="contaovos/positivity"
  {params}
  {theme}
  {language}
  {width}
  {height}
/>
