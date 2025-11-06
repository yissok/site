<script lang="ts">
  import TimelineRecord from "./TimelineRecord.svelte";

  import type { Directions, Record } from "./js/routeData";
  import { DEFAULT_DIRECTIONS } from "./js/routeData";
  export let directions: Directions = DEFAULT_DIRECTIONS;

  const rowHeight = 100;
  const spaceBetweenRows = 5;
  const defaultRowHeight = rowHeight + spaceBetweenRows;
  const headerHeight = 30;
  const oneMinute = 1 * 60 * 1000;

  var minTime: number;
  var maxTime: number;
  var timeRange: number;
  var gridUnit: number = oneMinute;
  var gridLines: Date[] = [];
  var timelineHeight: number;

  $: {
    minTime = getMinTimeRounded(directions.records!);
    maxTime = getMaxTimeRounded(directions.records!);
    timeRange = maxTime - minTime;
    gridUnit = adjustGridUnit(timeRange, oneMinute);
    gridLines = [];
    for (let t = minTime; t <= maxTime; t += gridUnit) {
      gridLines.push(new Date(t));
    }
    timelineHeight =
      directions.records!.length * defaultRowHeight + headerHeight;
  }

  function formatTime(date: Date) {
    return date.toTimeString().split(" ")[0].slice(0, 5);
  }

  function adjustGridUnit(timeRange: number, oneMinute: number): number {
    let gridUnit = oneMinute; // Start with the smallest unit
    while (timeRange / gridUnit > 10) {
      if (gridUnit === oneMinute) {
        gridUnit = oneMinute * 5;
      } else {
        gridUnit += oneMinute * 5;
      }
    }
    return gridUnit;
  }

  function getRoundedTime(records: Record[], roundType: "min" | "max"): number {
    if (records.length === 0) return 0; // Handle empty records

    const oneMinute = 60 * 1000; // Milliseconds in one minute
    const interval = 15 * oneMinute; // 15-minute interval in milliseconds

    // Extract all start or end times based on the desired rounding type
    const times =
      roundType === "min"
        ? records.map((record) => record.start.getTime())
        : records.map((record) => record.end.getTime());

    // Find the extreme value (min or max)
    const time = roundType === "min" ? Math.min(...times) : Math.max(...times);

    // Calculate intervals passed and round accordingly
    const intervals =
      roundType === "min"
        ? Math.floor(time / interval) // Round down for minimum
        : Math.ceil(time / interval); // Round up for maximum

    // Return the rounded time
    return intervals * interval;
  }

  function getMinTimeRounded(records: Record[]): number {
    return getRoundedTime(records, "min");
  }

  function getMaxTimeRounded(records: Record[]): number {
    return getRoundedTime(records, "max");
  }

  let timelineDiv: HTMLDivElement; // Reference for the div
  let timelineWidth: number = 0; // Variable to store the width of the timeline

  // Function to update width when needed
  const updateWidth = () => {
    if (timelineDiv) {
      timelineWidth = timelineDiv.offsetWidth; // Get the width of the element
    }
  };

  // Update the width on component mount
  import { onMount } from "svelte";

  onMount(() => {
    // Only access window after the component is mounted on the client
    if (typeof window !== "undefined") {
      updateWidth(); // Get the initial width

      // Add event listener to update width on window resize
      window.addEventListener("resize", updateWidth);

      // Clean up event listener when component is destroyed
      return () => {
        window.removeEventListener("resize", updateWidth);
      };
    }
  });
</script>

<p>Visual Directions:</p>
<div
  bind:this={timelineDiv}
  class="timeline"
  style="height: {timelineHeight}px;"
>
  {#each gridLines as time}
    {@const leftPx = ((time.getTime() - minTime) / timeRange) * 100}
    {#if leftPx > 10 && leftPx < 90}
      <div
        class="grid-line"
        style="left: {leftPx}%; top: {headerHeight - 10}px"
      ></div>
      <div class="time-label" style="left: {leftPx}%">
        {formatTime(time)}
      </div>
    {/if}
  {/each}

  <!-- Render records -->
  {#each directions.records! as record, index}
    {@const width =
      ((record.end.getTime() - record.start.getTime()) / timeRange) *
      timelineWidth}
    <div
      class="record-div"
      style="
          left: {((record.start.getTime() - minTime) / timeRange) * 100}%;
          width: {width}px;
          height: {rowHeight}px;
          top: {index * defaultRowHeight + headerHeight}px;
        "
    >
      <TimelineRecord {record} {width} height={rowHeight} />
    </div>
  {/each}
</div>

<style>
  .timeline {
    position: relative;
    width: 100%;
    /* border: 1px solid #000; */
    overflow: hidden;
  }
  .time-label {
    position: absolute;
    top: 5px; /* Adjust to position the label at the top */
    transform: translateX(-50%); /* Center align the label */
    font-size: 12px;
  }
  .grid-line {
    position: absolute;
    bottom: 0;
    width: 2px;
    background-color: #ececec;
  }
  .record-div {
    position: absolute;
  }
</style>
