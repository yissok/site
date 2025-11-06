<script lang="ts">
  import type { Record } from "./js/routeData";

  const topEmptySpace = 20;
  const borderRadius = 10;
  const timePoleHeight = borderRadius + topEmptySpace;
  let {
    record,
    width,
    height,
    //add here property to change color and pattern to show which is slow bus
  }: {
    record: Record;
    width: number;
    height: number;
  } = $props();
</script>

<div class="record" style="height: {height}px">
  <div class="grid-line left" style="height: {timePoleHeight}px"></div>
  <div
    class="child"
    style="height: {height -
      topEmptySpace}px; border-bottom-left-radius: {borderRadius}px; border-bottom-right-radius: {borderRadius}px;"
  >
    {record.content} - {Math.floor(width * 10) / 10}
  </div>
  <div class="grid-line right" style="height: {timePoleHeight}px"></div>
</div>

<style>
  .record {
    width: 100%;
    height: 100%;
    display: flex;
    /* border: 1px solid #000; */
    color: #fff;
    text-align: center;
    line-height: 20px; /* Match the height for vertical centering */
    white-space: nowrap;
  }

  .child {
    width: 100%;
    /* display: inline-block; */
    display: flex;
    justify-content: center;
    align-items: center;

    align-self: flex-end;
    background-color: #3498db;
    text-align: center;
  }
  .grid-line {
    top: 0px;
    position: absolute;
    width: 2px;
    background-color: #3498db;
    z-index: -1;
  }

  .grid-line.left {
    left: 0px;
  }

  .grid-line.right {
    right: 0px;
  }
</style>
