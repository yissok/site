<script lang="ts">
  import LocationInputs from "./LocationInputs.svelte";
  import TimeGraph from "./TimeGraph.svelte";
  import CoachTimes from "./CoachTimes.svelte";
  import TextDirections from "./TextDirections.svelte";
  import { handleCheckboxChange } from "./js/routeLogic";
  import type { Record, Directions } from "./js/routeData";
  import { DEFAULT_DIRECTIONS } from "./js/routeData";

  let otherLocation: string = $state("london bridge");
  let timetableLocation: string = $state("potters bar");
  let directions: Directions = $state(DEFAULT_DIRECTIONS);
</script>

<LocationInputs bind:otherLocation bind:timetableLocation />
<CoachTimes
  bind:otherLocation
  bind:timetableLocation
  bind:directions
  {handleCheckboxChange}
/>
<TimeGraph {directions} />
<TextDirections {directions} />
