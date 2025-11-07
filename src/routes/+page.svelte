<script lang="ts">
  import DebugPanel from "./DebugPanel.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    console.log("Page mounted");
  });
  const office = { lat: 51.515, lng: -0.141 };
  const RADIUS_METERS = 100;
  // const apiUrl =
  //   "https://script.google.com/macros/s/AKfycbzTJfFf3es-C2JxUMGGSuaR0A06M35SI12befH1JygZssaIYqXeTQVPysEXvV7IbOUlgw/exec";
  const googleUrl =
    "https://script.google.com/macros/s/AKfycbzTJfFf3es-C2JxUMGGSuaR0A06M35SI12befH1JygZssaIYqXeTQVPysEXvV7IbOUlgw/exec";
  const apiUrl =
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(googleUrl);

  let name = "mario";
  let surname = "super";
  let status = "";

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

  async function tapIn() {
    status = "Checking location...";
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = getDistance(office, { lat: latitude, lng: longitude });
        if (dist >= RADIUS_METERS) {
          status = "Logging your check-in...";
          const apiUrl =
            "https://api.allorigins.win/raw?url=" +
            encodeURIComponent(
              "https://script.google.com/macros/s/AKfycbzxUMRfkRQ9uRfLmhLgL8vqj3WlORaQBE4-JQGfoV2H-7HGyJjIYbauEc-iir8fHSfCdA/exec" +
                "?name=" +
                encodeURIComponent(name) +
                "&surname=" +
                encodeURIComponent(surname) +
                "&lat=" +
                latitude +
                "&lng=" +
                longitude,
            );
          await fetch(apiUrl);

          status = "✅ Logged successfully!";
        } else {
          status = "❌ You are not at the office!";
        }
      },
      (err) => {
        status = "Location error: " + err.message;
      },
    );
  }
</script>

<h1>Office Tap-In2</h1>
<input placeholder="name" bind:value={name} />
<input placeholder="surname" bind:value={surname} />
<button on:click={tapIn}>Tap In</button>
<p>{status}</p>

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
