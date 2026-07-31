<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Language, Theme } from "@mosqlimate/charts";
  import { provideMosqlimate } from "./context";
  import type { MosqlimateContextValue } from "./types";

  interface Props {
    api_key?: string;
    sdk_key?: string;
    theme?: Theme;
    language?: Language;
    children?: Snippet;
  }

  let { api_key, sdk_key, theme, language, children }: Props = $props();

  let ctx = $state<MosqlimateContextValue>({});
  provideMosqlimate(ctx);

  $effect(() => {
    ctx.api_key = api_key;
    ctx.sdk_key = sdk_key;
    ctx.theme = theme;
    ctx.language = language;
  });

  $effect(() => {
    void api_key;
    void sdk_key;
    void theme;
    void language;
    (async () => {
      const { Mosqlimate } = await import("@mosqlimate/charts");
      if (sdk_key) Mosqlimate.setSdkKey(sdk_key);
      if (api_key) Mosqlimate.setApiKey(api_key);
      if (theme || language)
        Mosqlimate.configure({
          ...(theme ? { theme } : {}),
          ...(language ? { language } : {}),
        });
    })();
  });
</script>

{@render children?.()}
