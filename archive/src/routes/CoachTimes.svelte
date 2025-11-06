<script lang="ts">
  import type { Directions, Record } from "./js/routeData";

  let {
    handleCheckboxChange,
    directions = $bindable(),
    otherLocation = $bindable(),
    timetableLocation = $bindable(),
  }: {
    handleCheckboxChange: (
      event: Event,
      otherLocation: string,
      timetableLocation: string,
    ) => Promise<Directions>;
    directions: Directions;
    otherLocation: string;
    timetableLocation: string;
  } = $props();

  const timetable = [
    ["07:10", "07:20", "-", "-", "-", "07:30"],
    ["07:30", "07:40", "-", "-", "-", "07:50"],
    ["07:55", "08:10", "-", "-", "-", "08:20"],
    ["-", "-", "07:30", "07:35", "07:40", "07:50"],
    ["-", "-", "08:25", "08:30", "08:35", "08:40"],
    ["-", "08:30", "-", "-", "-", "08:40"],
    ["-", "-", "08:35", "08:40", "08:45", "08:50"],
    ["-", "08:40", "-", "08:45", "08:50", "08:58"],
    ["08:45", "08:55", "-", "-", "-", "09:10"],
    ["09:00", "09:10", "09:20", "09:30", "09:35", "09:40"],
    ["-", "09:15", "-", "09:20", "09:25", "09:33"],
    ["09:15", "09:25", "-", "-", "-", "09:35"],
    ["09:45", "09:55", "-", "-", "-", "10:05"],
    ["10:15", "10:25", "-", "10:30", "10:35", "10:40"],
    ["10:45", "10:55", "-", "-", "-", "11:05"],
    ["11:15", "11:25", "11:30", "-", "-", "11:45"],
    ["12:15", "12:25", "-", "12:30", "12:33", "12:40"],
    ["13:15", "13:25", "13:30", "-", "-", "13:45"],
    ["13:45", "13:55", "-", "-", "-", "14:05"],
    ["14:15", "14:25", "-", "14:30", "14:33", "14:40"],
    ["14:45", "14:55", "15:00", "-", "-", "15:15"],
    ["15:15", "15:25", "-", "-", "-", "15:35"],
    ["15:40", "15:50", "-", "-", "-", "16:00"],
    ["16:05", "16:15", "-", "16:25", "16:30", "16:35"],
    ["16:20", "16:30", "16:40", "-", "-", "17:00"],
    ["16:40", "16:50", "-", "-", "-", "17:00"],
    ["17:10", "17:15", "-", "17:25", "17:30", "17:38"],
    ["17:15", "17:25", "-", "17:35", "17:40", "17:48"],
    ["17:30", "17:40", "-", "-", "-", "17:50"],
    ["17:45", "17:55", "18:00", "-", "-", "18:15"],
    ["18:00", "18:10", "-", "-", "-", "18:20"],
    ["18:45", "18:55", "19:00", "19:05", "19:08", "19:18"],
    ["19:45", "19:55", "20:00", "20:05", "20:08", "20:18"],
    ["20:20", "20:30", "20:35", "20:40", "20:45", "20:55"],
    [
      "21:15",
      "drop off only",
      "drop off only",
      "drop off only",
      "drop off only",
      "drop off only",
    ],
  ];
</script>

<details class="details-container">
  <summary>Select Times:</summary>
  <div class="scrollable-container">
    <table>
      <tbody>
        {#each timetable as row}
          <tr>
            {#each row as time}
              <td>
                <label>
                  <input
                    type="radio"
                    name="timeGroup"
                    value={time}
                    onchange={async (event) => {
                      directions = await handleCheckboxChange(
                        event,
                        otherLocation,
                        timetableLocation,
                      );
                    }}
                    disabled={time === "-" ||
                      time.toLowerCase() === "drop off only"}
                  />
                  {time}
                </label>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</details>

<style>
  .details-container {
    display: block;
  }

  /* Hide scrollbars in WebKit browsers */
  .scrollable-container::-webkit-scrollbar {
    display: none;
  }

  .scrollable-container {
    max-height: 0; /* Initially collapsed */
    overflow-y: hidden; /* Hide overflow */
    scrollbar-width: none; /* For Firefox */
  }

  .details-container[open] .scrollable-container {
    max-height: 100px; /* Set height when expanded */
    overflow-y: auto; /* Allow vertical scroll */
  }

  summary {
    cursor: pointer;
    padding: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  td {
    padding: 5px;
    text-align: left; /* Aligns text to the left */
    width: calc(100% / 6); /* Ensures all cells have the same width */
  }
  label {
    display: inline-flex;
    align-items: center;
  }
</style>
