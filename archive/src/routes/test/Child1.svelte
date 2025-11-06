<script lang="ts">
    export let myBinding: string;
</script>

<input
    type="text"
    id="user-location"
    bind:value={myBinding}
    placeholder=""
    style="font-family: 'Courier', monospace;"
/>
