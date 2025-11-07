<script lang="ts">
  import { currentBackgroundColor } from "../lib/tabStore";
  import { showSecretButtons } from "../lib/secretStore";

  const commitHash = import.meta.env.VITE_GIT_COMMIT_HASH
    ? import.meta.env.VITE_GIT_COMMIT_HASH.slice(0, 7)
    : "0000000"; // A default, valid hex-like string for local testing

  const repoUrl = `https://github.com/yissok/site/commit/${import.meta.env.VITE_GIT_COMMIT_HASH || "local-test"}`;

  // Convert first 6 hex digits to a number
  const hashInt = parseInt(commitHash.slice(0, 6), 16);
  // Map hash to a color in HSL
  const hue = hashInt % 360; // Get a value between 0 and 360 for hue
  const saturation = 30; // Keep it vibrant
  const lightness = 40; // Keep it balanced

  currentBackgroundColor.set(`hsl(${hue}, ${saturation}%, ${lightness}%)`);

  function handleRhythm() {
    showSecretButtons.set(true);
  }
</script>

<footer class="footer" style="background-color: {$currentBackgroundColor};">
  <!-- <p>
    <a
      class="commit-link"
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
    > -->
  <span class="commit-symbol">-o-</span>
  {commitHash}
  <!-- </a>
  </p> -->
</footer>

<style>
  .footer {
    color: #ffffff; /* White text */
    padding-left: 12px;
    padding-bottom: 34px;
    font-family: "Courier", monospace;

    font-size: 6px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
  }

  .commit-symbol {
    color: #facc15; /* Yellow */
  }
</style>
