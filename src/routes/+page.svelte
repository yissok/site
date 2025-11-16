<script lang="ts">
  import { onMount } from "svelte";
  import DebugPanel from "./DebugPanel.svelte";
  import Commit from "./Commit.svelte";

  const RADIUS_METERS = 20000;

  let name = "mario";
  let surname = "super";
  let status = "";
  let map: any;
  let marker: any;
  let userLat: number | null = null;
  let userLng: number | null = null;
  let leafletLoaded = false;
  let awaitingConfirmation = false;
  let showThankYou = false;

  // @ts-ignore
  declare const L: any;

  let userMarker, officeMarker, line;
  let officeMarkers = [];

  let offices = [
    { name: "London HQ", lat: 51.5183547, lng: -0.1161728 },
    { name: "Paris Office", lat: 48.8566, lng: 2.3522 },
    { name: "Berlin Hub", lat: 52.52, lng: 13.405 },
    { name: "Madrid Office", lat: 40.4168, lng: -3.7038 },
  ];
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdE-Rq8RfWoa7O4L5ub9DLSFFKy8CHdWXYSd35jFzycwhRhsA/formResponse";

  const ENTRY_NAME = "entry.1134445879";
  const ENTRY_SURNAME = "entry.931613039";
  const ENTRY_LAT = "entry.55118251";
  const ENTRY_LNG = "entry.146123109";

  onMount(async () => {
    if (!window.L) {
      await loadLeaflet();
      leafletLoaded = true;
      console.log("✅ Leaflet loaded");
    } else {
      leafletLoaded = true;
    }
    offices = await loadOffices();
    console.log("Offices loaded from sheet:", offices);
  });
  async function loadOffices() {
    const url =
      "https://docs.google.com/spreadsheets/d/1WhjBZMg4eJRWeNxbz5kHMp_Qq56it6Py-LEuozAZfuc/gviz/tq?tqx=out:json&gid=2065176163&tq=SELECT B,C,D";

    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rows = json.table.rows;

    const result = [];

    for (const r of rows) {
      const lat = r.c[0]?.v;
      const lng = r.c[1]?.v;
      const name = r.c[2]?.v;

      // Skip header, missing, and #N/A rows
      if (!lat || !lng || !name) continue;
      if (lat === "#N/A" || lng === "#N/A") continue;

      result.push({
        name: name.trim(),
        lat: Number(lat),
        lng: Number(lng),
      });
    }

    return result;
  }

  async function loadLeaflet() {
    return new Promise((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

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
    // Step 1: If we don’t yet have a location, get it
    if (!userLat || !userLng) {
      status = "📍 Getting your current location...";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLat = pos.coords.latitude;
          userLng = pos.coords.longitude;
          const nearestOffice = getNearestOffice(userLat, userLng);

          const dist = getDistance(nearestOffice, {
            lat: userLat,
            lng: userLng,
          });
          status = `${Math.round(dist)}m from ${nearestOffice.name}`;

          showMap();

          // Ask user to confirm after seeing map
          awaitingConfirmation = true;
        },
        (err) => {
          status = "⚠️ Location error: " + err.message;
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
      return;
    }

    // Step 2: If we already have a location, confirm and submit
    if (awaitingConfirmation) {
      const office = getNearestOffice(userLat, userLng);
      const dist = getDistance(office, { lat: userLat, lng: userLng });
      if (dist > RADIUS_METERS) {
        status = "❌ You are not at the office!";
        return;
      }

      status = "⏳ Logging your check-in...";

      const formData = new FormData();
      formData.append(ENTRY_NAME, name);
      formData.append(ENTRY_SURNAME, surname);
      formData.append(ENTRY_LAT, userLat.toString());
      formData.append(ENTRY_LNG, userLng.toString());

      try {
        await fetch(formUrl, {
          method: "POST",
          mode: "no-cors",
          body: formData,
        });
        status = "✅ Logged successfully!";
        showThankYou = true;
      } catch (err) {
        console.error("❌ Error:", err);
        status = "❌ Failed to log.";
      }

      // Reset confirmation state
      awaitingConfirmation = false;
      return;
    }
  }
  function showMap() {
    if (!L) {
      console.warn("Leaflet not loaded yet");
      return;
    }

    if (!map) {
      map = L.map("map").setView([userLat, userLng], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
    }

    // Remove old markers/lines
    if (userMarker) map.removeLayer(userMarker);
    if (officeMarkers) officeMarkers.forEach((m) => map.removeLayer(m));
    if (line) map.removeLayer(line);

    const nearest = getNearestOffice(userLat, userLng);
    if (!nearest) return;

    const greyIcon = L.icon({
      iconUrl: "/office.png",
      iconSize: [64, 64],
      iconAnchor: [32, 64],
      popupAnchor: [0, -64],
    });

    const highlightIcon = L.icon({
      iconUrl: "/office-selected.png", // optional highlight version
      iconSize: [72, 72],
      iconAnchor: [36, 72],
      popupAnchor: [0, -72],
    });

    // 🔥 Draw ALL offices
    officeMarkers = [];
    offices.forEach((o) => {
      const icon = o.name === nearest.name ? highlightIcon : greyIcon;
      const marker = L.marker([o.lat, o.lng], { icon, zIndexOffset: 0 })
        .bindPopup(o.name)
        .addTo(map);
      officeMarkers.push(marker);
    });

    // User marker on top
    userMarker = L.marker([userLat, userLng], {
      zIndexOffset: 1000,
    }).addTo(map);

    // Dotted line only to nearest
    line = L.polyline(
      [
        [userLat, userLng],
        [nearest.lat, nearest.lng],
      ],
      { color: "#0078ff", weight: 2, dashArray: "6 6" },
    ).addTo(map);

    map.fitBounds([
      [userLat, userLng],
      [nearest.lat, nearest.lng],
    ]);

    map.setView([userLat, userLng], 16);
  }

  async function testTapInForm() {
    status = "Logging your check-in...";
    const formData = new FormData();
    formData.append("entry.1134445879", "Mario");
    formData.append("entry.931613039", "Super");
    formData.append("entry.55118251", "0.123");
    formData.append("entry.146123109", "0.456");
    try {
      await fetch(formUrl, { method: "POST", mode: "no-cors", body: formData });
      console.log("✅ Submitted to form");
      status = "✅ Logged successfully!";
    } catch (err) {
      console.error("❌ Error:", err);
      status = "❌ Failed to log.";
    }
  }

  function getNearestOffice(userLat, userLng) {
    let nearest = null;
    let minDist = Infinity;

    for (const office of offices) {
      const d = haversine(userLat, userLng, office.lat, office.lng);
      if (d < minDist) {
        minDist = d;
        nearest = office;
      }
    }

    return nearest;
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
</script>

<main>
  {#if showThankYou}
    <!-- ✅ Thank you screen -->
    <div class="thank-you">
      <h2>✅ Thanks for checking in!</h2>
      <p>Your location has been logged successfully</p>

      <button class="reload-btn" on:click={() => location.reload()}>
        🔄 Tap In Again
      </button>
    </div>
  {:else}
    <!-- 🗺️ Original UI -->
    <h1>Office Tap-In</h1>

    <div class="inputs">
      <input placeholder="name" bind:value={name} />
      <input placeholder="surname" bind:value={surname} />
    </div>

    <button class="tap-btn" on:click={tapIn}>
      {awaitingConfirmation ? "✅ Confirm & Submit" : "Tap In"}
    </button>

    <button class="test-btn" on:click={testTapInForm}>testTapInForm</button>

    <div id="map"></div>

    {#if userLat && userLng}
      <p>your location is: ({userLat.toFixed(5)}, {userLng.toFixed(5)})</p>
    {/if}

    <p class="status">{status}</p>

    <Commit />
    <!--<DebugPanel />-->
  {/if}
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

  #map {
    width: 100%;
    height: 300px;
    max-width: 500px;
    margin-top: 1rem;
    border-radius: 1rem;
    overflow: hidden;
  }

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
    transition: transform 0.15s ease;
    font-family: "Courier", monospace;
  }

  .tap-btn:active {
    transform: scale(0.97);
  }

  .status {
    margin-top: 1.5rem;
    font-size: 1rem;
    color: #333;
    min-height: 2rem;
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
    font-family: "Courier", monospace;
  }
  :global(html) {
    font-family: "Courier", monospace;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
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
  .thank-you {
    text-align: center;
    padding: 3rem;
    background: #f6f8fa;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .reload-btn {
    margin-top: 2rem;
    background-color: #0078ff;
    color: white;
    font-size: 1.1rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .reload-btn:hover {
    background-color: #005fcc;
  }
</style>
