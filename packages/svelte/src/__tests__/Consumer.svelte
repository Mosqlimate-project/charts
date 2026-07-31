<script lang="ts">
  import { useMosqlimate } from "../lib/context";

  const ctx = useMosqlimate();
  let json = $derived(JSON.stringify(ctx));
</script>

<div data-testid="ctx">{json}</div>
