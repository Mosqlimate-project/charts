<script lang="ts">
  import type { ChartParams } from "@mosqlimate/charts";
  import MosqlimateChart from "./chart.svelte";
  import type { RtChartProps } from "./types";

  let {
    disease,
    geocode,
    start,
    end,
    theme,
    language,
    width,
    height,
  }: RtChartProps = $props();

  const params = $derived({ disease, geocode, start, end } as ChartParams);
</script>

<MosqlimateChart
  chart="infodengue/rt"
  {params}
  {theme}
  {language}
  {width}
  {height}
/>
