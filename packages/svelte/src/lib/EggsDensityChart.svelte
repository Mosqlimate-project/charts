<script lang="ts">
  import type { ChartParams } from "@mosqlimate/charts";
  import MosqlimateChart from "./chart.svelte";
  import type { EggsDensityChartProps } from "./types";

  let {
    start,
    end,
    uf,
    geocode,
    theme,
    language,
    width,
    height,
  }: EggsDensityChartProps = $props();

  const params = $derived({ start, end, uf, geocode } as ChartParams);
</script>

<MosqlimateChart
  chart="contaovos/eggs_density"
  {params}
  {theme}
  {language}
  {width}
  {height}
/>
