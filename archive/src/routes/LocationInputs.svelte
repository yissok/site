<script lang="ts">
  import QueryFilters from "./QueryFilters.svelte";
  export let otherLocation: string;
  export let timetableLocation: string;
</script>

<QueryFilters />
<table>
  <tbody>
    <tr>
      <td>
        <label for="user-location">Other location:</label>
      </td>
      <td>
        <input
          type="text"
          id="user-location"
          bind:value={otherLocation}
          placeholder=""
          style="font-family: 'Courier', monospace;"
        />
      </td>
    </tr>
    <tr>
      <td>
        <label for="end-location">RVC coach stop:</label>
      </td>
      <td>
        <input
          type="text"
          id="end-location"
          bind:value={timetableLocation}
          placeholder=""
          style="font-family: 'Courier', monospace;"
        />
      </td>
    </tr>
  </tbody>
</table>
