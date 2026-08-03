<script lang="ts">
  import type { ChartParams } from "@mosqlimate/charts";
  import MosqlimateChart from "./chart.svelte";
  import type { EpiscannerChartProps } from "./types";

  let {
    disease,
    uf,
    year,
    metric,
    theme,
    language,
    width,
    height,
  }: EpiscannerChartProps = $props();

  const params = $derived({ disease, uf, year, metric } as ChartParams);
</script>

<MosqlimateChart
  chart="episcanner"
  {params}
  {theme}
  {language}
  {width}
  {height}
/>
