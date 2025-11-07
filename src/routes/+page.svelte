<script lang="ts">
  import DebugPanel from "./DebugPanel.svelte";
  import Commit from "./Commit.svelte";
  import { onMount } from "svelte";

  const office = { lat: 51.5183547, lng: -0.1161728 };
  const RADIUS_METERS = 20000;
  const googleUrl =
    "https://script.google.com/macros/s/AKfycbx5JAkyttDJXCXPJeHFbsTIEhFpvXHbRKoixdP6kFTMjLdry2KTh-LG2ae7Ctt_9NAw/exec";
  const proxyBase = "https://api.allorigins.win/raw?url=";

  let name = "mario";
  let surname = "super";
  let status = "";
  let retries = 0;
  let maxRetries = 3;

  onMount(() => {
    console.log("Page mounted");
    // Catch global unhandled rejections for good measure
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      status =
        "❌ Unhandled network error: " + (event.reason?.message || "Unknown");
    });
  });

  function getDistance(a, b) {
    const R = 6371e3;
    const φ1 = (a.lat * Math.PI) / 180;
    const φ2 = (b.lat * Math.PI) / 180;
    const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
    const Δλ = ((b.lng - a.lng) * Math.PI) / 180;

    const x = Δλ * Math.cos((φ1 + φ2) / 2);
    const y = Δφ;
    const d = Math.sqrt(x * x + y * y) * R;
    return d;
  }

  async function safeFetch(url: string, retriesLeft = maxRetries) {
    try {
      const res = await fetch(url);
      console.log("Fetch response:", res);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      console.error("Fetch error:", err);
      if (retriesLeft > 0) {
        retries++;
        status = `⚠️ Network error, retrying (${maxRetries - retriesLeft + 1}/${maxRetries})...`;
        await new Promise((r) => setTimeout(r, 1500)); // wait 1.5s
        return safeFetch(url, retriesLeft - 1);
      } else {
        throw new Error("❌ Network failed after retries.");
      }
    }
  }

  async function tapIn() {
    status = "📍 Checking location...";
    retries = 0;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("Current position:", latitude, longitude);
        const dist = getDistance(office, { lat: latitude, lng: longitude });

        if (dist <= RADIUS_METERS) {
          status = "⏳ Logging your check-in...";
          const fullUrl =
            proxyBase +
            encodeURIComponent(
              googleUrl +
                "?name=" +
                encodeURIComponent(name) +
                "&surname=" +
                encodeURIComponent(surname) +
                "&lat=" +
                latitude +
                "&lng=" +
                longitude +
                "&t=" +
                Date.now(), // 👈 cache buster
            );

          try {
            await safeFetch(fullUrl);
            status = "✅ Logged successfully!";
          } catch (err) {
            status = err.message;
          }
        } else {
          status = "❌ You are not at the office!";
        }
      },
      (err) => {
        status = "⚠️ Location error: " + err.message;
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function tapInTest() {
    status = "⏳ Logging test check-in...";
    retries = 0;
    const testUrl =
      proxyBase +
      encodeURIComponent(
        googleUrl +
          "?name=" +
          encodeURIComponent(name) +
          "&surname=" +
          encodeURIComponent(surname) +
          "&lat=1.1&lng=2.2" +
          "&t=" +
          Date.now(), // 👈 cache buster
      );

    try {
      await safeFetch(testUrl);
      status = "✅ Test logged successfully!";
    } catch (err) {
      status = err.message;
    }
  }
</script>

<!-- UI -->
<main>
  <h1>Office Tap-In</h1>

  <div class="inputs">
    <input placeholder="name" bind:value={name} />
    <input placeholder="surname" bind:value={surname} />
  </div>

  <button class="tap-btn" on:click={tapIn}>Tap In</button>
  <button class="test-btn" on:click={tapInTest}>Developer Test</button>

  <p class="status">{status}</p>

  <Commit />
  <DebugPanel />
</main>

<style>
  /* 🟢 Mobile-first layout */
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
    text-align: center;
    background: linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%);
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  input {
    padding: 0.8rem;
    font-size: 1rem;
    border-radius: 0.75rem;
    border: 1px solid #ccc;
    width: 100%;
    box-sizing: border-box;
  }

  /* Big main Tap button — fills most of the screen on mobile */
  .tap-btn {
    width: 100%;
    max-width: 400px;
    height: 35vh;
    font-size: 2rem;
    font-weight: bold;
    color: white;
    background: #0078ff;
    border: none;
    border-radius: 1.5rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    transition:
      transform 0.15s ease,
      background 0.2s;
  }

  .tap-btn:active {
    transform: scale(0.97);
    background: #005ec2;
  }

  .test-btn {
    margin-top: 1rem;
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    border-radius: 0.75rem;
    background: #ddd;
    border: none;
  }

  .status {
    margin-top: 1.5rem;
    font-size: 1rem;
    color: #333;
    min-height: 2rem;
  }

  /* Desktop tweaks */
  @media (min-width: 600px) {
    h1 {
      font-size: 2rem;
    }
    .tap-btn {
      height: 30vh;
      max-width: 500px;
    }
  }

  :global(html) {
    font-family: "Courier", monospace;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>
