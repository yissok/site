<script lang="ts">
  import DebugPanel from "./DebugPanel.svelte";
  import Commit from "./Commit.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    console.log("Page mounted");
  });
  const office = { lat: 51.5183547, lng: -0.1161728 };
  const RADIUS_METERS = 200;
  const googleUrl =
    "https://script.google.com/macros/s/AKfycbx5JAkyttDJXCXPJeHFbsTIEhFpvXHbRKoixdP6kFTMjLdry2KTh-LG2ae7Ctt_9NAw/exec";
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
        console.log("Current position:", latitude, longitude);
        const dist = getDistance(office, { lat: latitude, lng: longitude });
        if (dist <= RADIUS_METERS) {
          status = "Logging your check-in...";
          const apiUrl =
            "https://api.allorigins.win/raw?url=" +
            encodeURIComponent(
              googleUrl +
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

  async function tapInTest() {
    status = "Checking location...";
    status = "Logging your check-in...";

    const payload = {
      name: "mario",
      surname: "super",
      lat: 0.123,
      lng: 0.456,
    };

    try {
      const response = await fetch(googleUrl, {
        method: "POST",
        mode: "cors", // important for mobile
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const text = await response.text();
      console.log("✅ Success:", text);
      status = "✅ Logged successfully!";
    } catch (err) {
      console.error("❌ Error:", err);
      status = "❌ Failed to log. Check console.";
    }
  }

  async function tapalloriginInTest() {
    const params = new URLSearchParams({
      name: "mario",
      surname: "super",
      lat: "0.123",
      lng: "0.456",
    });

    const googleUrl2 = `${googleUrl}?${params}`;

    // Wrap with AllOrigins to bypass CORS
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(googleUrl2)}`;

    try {
      const response = await fetch(proxyUrl);

      const data = await response.json();
      console.log("✅ Response:", data.contents);
    } catch (err) {
      console.error("❌ Error:", err);
    }
  }
</script>

<h1>Office Tap-In</h1>
<input placeholder="name" bind:value={name} />
<input placeholder="surname" bind:value={surname} />
<button on:click={tapIn}>Tap In</button>
<button on:click={tapInTest}>Tap In (developer test)</button>
<button on:click={tapalloriginInTest}>Tap In (allorig)</button>
<p>{status}</p>
<Commit />
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
