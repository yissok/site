<script lang="ts">
  import type { Directions } from "./js/routeData";
  import { DEFAULT_DIRECTIONS } from "./js/routeData";
  export let directions: Directions = DEFAULT_DIRECTIONS;
</script>

{#if directions.routeData?.routes}
  <p>Text Directions:</p>
  {#each directions.routeData!.routes as route, routeIndex}
    <details>
      <summary>
        {route.legs[0].departure_time.text.padStart(8, "0")} -
        {route.legs[0].arrival_time.text.padStart(8, "0")}
      </summary>
      <ul>
        <li>
          <p>
            <strong>Start Address:</strong>
            {route.legs[0].start_address}
          </p>
          <p><strong>End Address:</strong> {route.legs[0].end_address}</p>
          <p>
            <strong>Distance:</strong>
            {route.legs[0].distance.text} ({route.legs[0].distance.value} meters)
          </p>
          <p>
            <strong>Duration:</strong>
            {route.legs[0].duration.text} ({route.legs[0].duration.value} seconds)
          </p>
          <ul>
            {#each route.legs[0].steps as step, stepIndex}
              <li>
                <p><strong>Step {stepIndex + 1}:</strong></p>
                <p>
                  <strong>Instruction:</strong>
                  {step.html_instructions}
                </p>
                <p><strong>Travel Mode:</strong> {step.travel_mode}</p>
                <p>
                  <strong>Distance:</strong>
                  {step.distance.text} ({step.distance.value} meters)
                </p>
                <p>
                  <strong>Duration:</strong>
                  {step.duration.text} ({step.duration.value} seconds)
                </p>
                {#if step.transit_details}
                  <p><strong>Transit Details:</strong></p>
                  <ul>
                    <li>
                      <strong>Arrival Stop:</strong>
                      {step.transit_details.arrival_stop.name}
                    </li>
                    <li>
                      <strong>Departure Stop:</strong>
                      {step.transit_details.departure_stop.name}
                    </li>
                    <li>
                      <strong>Headsign:</strong>
                      {step.transit_details.headsign}
                    </li>
                    <li>
                      <strong>Number of Stops:</strong>
                      {step.transit_details.num_stops}
                    </li>
                    <li>
                      <strong>Line:</strong>
                      {step.transit_details.line.name} ({step.transit_details
                        .line.short_name})
                    </li>
                    <li>
                      <strong>Agency:</strong>
                      {step.transit_details.line.agencies[0].name}
                    </li>
                    <li>
                      <strong>Vehicle:</strong>
                      {step.transit_details.line.vehicle.name}
                    </li>
                  </ul>
                {/if}
              </li>
            {/each}
          </ul>
        </li>
      </ul>
    </details>
  {/each}
{:else}
  <p>a</p>
{/if}
