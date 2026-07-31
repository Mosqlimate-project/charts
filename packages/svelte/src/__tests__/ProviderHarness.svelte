<script lang="ts">
  import type { Language, Theme } from "@mosqlimate/charts";
  import MosqlimateProvider from "../lib/context.svelte";
  import Consumer from "./Consumer.svelte";

  interface Props {
    api_key?: string;
    sdk_key?: string;
    theme?: Theme;
    language?: Language;
  }

  let { api_key, sdk_key, theme, language }: Props = $props();
</script>

<MosqlimateProvider {api_key} {sdk_key} {theme} {language}>
  <Consumer />
</MosqlimateProvider>
