<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  // Store for log messages
  export const logs = writable<string[]>([]);

  let isOpen = false;

  function togglePanel() {
    isOpen = !isOpen;
  }

  function addLog(message: string) {
    logs.update((current) => [...current, message]);
  }

  // Override console.log so that logs appear in our panel.
  onMount(() => {
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      originalConsoleLog(...args);
      addLog(args.map(String).join(" "));
    };

    // Listen for global errors.
    window.addEventListener("error", (event) => {
      const errorMsg = `Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
      addLog(errorMsg);
    });

    // Listen for unhandled promise rejections.
    window.addEventListener("unhandledrejection", (event) => {
      const errorMsg = `Unhandled Promise Rejection: ${event.reason}`;
      addLog(errorMsg);
    });
  });
</script>

{#if isOpen}
  <div class="debug-panel">
    <button class="close-button" on:click={togglePanel}>Close</button>
    {#each $logs as log}
      <div class="log-entry">{log}</div>
    {/each}
  </div>
{/if}

<button class="toggle-button" on:click={togglePanel}>
  {isOpen ? "Hide Debug Panel" : "Show Debug Panel"}
</button>

<style>
  .debug-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 50%;
    background: rgba(0, 0, 0, 0.8);
    color: #eee;

    font-family: "Courier", monospace;
    overflow-y: auto;
    padding: 0.5rem;
    z-index: 1000;
    font-size: 0.9rem;
  }
  .toggle-button {
    font-family: "Courier", monospace;
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 1001;
    padding: 0.5rem 1rem;
    background: #333;
    color: white;
    border: none;
    cursor: pointer;
  }
  .close-button {
    font-family: "Courier", monospace;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #444;
    border: none;
    color: white;
    cursor: pointer;
  }
  .log-entry {
    margin-bottom: 0.3rem;
    word-break: break-all;
  }
</style>
