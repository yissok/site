<script lang="ts">
  import DebugPanel from "./DebugPanel.svelte";
  import { onMount } from "svelte";
  onMount(() => {
    console.log("Page mounted");
  });
</script>

<DebugPanel />

<style>
  :global(html) {
    font-family: "Courier", monospace;
  }

  :global(html, body) {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }

  :global(*) {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
</style>
