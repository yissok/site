<script lang="ts">
  import { activeTab } from "$lib/tabStore";
  import Cells from "./cells/Cells.svelte";
  import { onMount } from "svelte";
  onMount(() => {
    const script = document.createElement("script");
    script.src = "/opencv.js";
    script.async = true;
    document.body.appendChild(script);
  });
</script>

<!-- Dynamic Content -->
{#if $activeTab === 1}{:else if $activeTab === 2}{:else if $activeTab === 3}
  <Cells />
{:else if $activeTab === 4}
  <div class="content">You're on Tab 4. Add any relevant content here.</div>
{:else if $activeTab === 5}
  <div class="content">This is Tab 5. Imagine something cool here!</div>
{/if}

<!-- <Commit /> -->
<!-- <DebugPanel></DebugPanel> -->

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
