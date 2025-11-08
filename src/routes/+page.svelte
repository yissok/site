<script lang="ts">
  import DebugPanel from "./DebugPanel.svelte";
  import Commit from "./Commit.svelte";
  import { onMount } from "svelte";

  const office = { lat: 51.5183547, lng: -0.1161728 };
  const RADIUS_METERS = 20000; // adjust as needed

  let name = "mario";
  let surname = "super";
  let status = "";

  // your real formResponse URL
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdE-Rq8RfWoa7O4L5ub9DLSFFKy8CHdWXYSd35jFzycwhRhsA/formResponse";

  // replace these with your actual entry IDs
  const ENTRY_NAME = "entry.1134445879";
  const ENTRY_SURNAME = "entry.931613039";
  const ENTRY_LAT = "entry.55118251";
  const ENTRY_LNG = "entry.146123109";

  onMount(() => {
    console.log("Page mounted");
  });

  // Haversine distance
  function getDistance(a, b) {
    const R = 6371e3;
    const φ1 = (a.lat * Math.PI) / 180;
    const φ2 = (b.lat * Math.PI) / 180;
    const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
    const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
    const x = Δλ * Math.cos((φ1 + φ2) / 2);
    const y = Δφ;
    return Math.sqrt(x * x + y * y) * R;
  }

  async function tapIn() {
    status = "📍 Checking location...";

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = getDistance(office, { lat: latitude, lng: longitude });

        if (dist > RADIUS_METERS) {
          status = "❌ You are not at the office!";
          return;
        }

        status = "⏳ Logging your check-in...";

        const formData = new FormData();
        formData.append(ENTRY_NAME, name);
        formData.append(ENTRY_SURNAME, surname);
        formData.append(ENTRY_LAT, latitude.toString());
        formData.append(ENTRY_LNG, longitude.toString());

        try {
          await fetch(formUrl, {
            method: "POST",
            mode: "no-cors", // required for Google Forms
            body: formData,
          });

          console.log("✅ Submitted to form");
          status = "✅ Logged successfully!";
        } catch (err) {
          console.error("❌ Error:", err);
          status = "❌ Failed to log.";
        }
      },
      (err) => {
        status = "⚠️ Location error: " + err.message;
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

async function testTapInForm() {
  status = "Logging your check-in...";

  const formData = new FormData();
  formData.append("entry.1134445879", "Mario"); // Name
  formData.append("entry.931613039", "Super"); // Surname
  formData.append("entry.55118251", "0.123"); // Lat
  formData.append("entry.146123109", "0.456"); // Lng

  try {
    await fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });
    console.log("✅ Submitted to form");
    status = "✅ Logged successfully!";
  } catch (err) {
    console.error("❌ Error:", err);
    status = "❌ Failed to log.";
  }
}
</script>

<main>
  <h1>Office Tap-In</h1>

  <div class="inputs">
    <input placeholder="name" bind:value={name} />
    <input placeholder="surname" bind:value={surname} />
  </div>

  <button class="tap-btn" on:click={tapIn}>Tap In</button>
  <button class="test-btn" on:click={testTapInForm}>testTapInForm</button>

  <p class="status">{status}</p>

  <Commit />
  <DebugPanel />
</main>

<style>
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
    font-family: "Courier", monospace;
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
    font-family: "Courier", monospace;
    border-radius: 0.75rem;
    border: 1px solid #ccc;
    width: 100%;
    box-sizing: border-box;
  }

  .tap-btn {
    width: 100%;
    max-width: 400px;
    height: 35vh;
    font-size: 2rem;
    font-weight: bold;
    font-family: "Courier", monospace;
    color: white;
    background: #0078ff;
    border: none;
    border-radius: 1.5rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    transition: transform 0.15s ease, background 0.2s;
  }

  .tap-btn:active {
    transform: scale(0.97);
    background: #005ec2;
  }

  .status {
    margin-top: 1.5rem;
    font-size: 1rem;
    color: #333;
    min-height: 2rem;
  }

  @media (min-width: 600px) {
    h1 {
      font-size: 2rem;
    }
    .tap-btn {
      height: 30vh;
      max-width: 500px;
    }
  }

  .test-btn {
    margin-top: 1rem;
    font-size: 1rem;
    font-family: "Courier", monospace;
    padding: 0.6rem 1.2rem;
    border-radius: 0.75rem;
    background: #ddd;
    border: none;
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
