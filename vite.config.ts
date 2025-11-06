import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    exclude: ["leaflet", "svelte-katex"], // Add dependencies that cause issues here
  },
  resolve: {
    alias: {
      $workers: "/src/workers",
      $lib: "/src/lib",
    },
  },
});
