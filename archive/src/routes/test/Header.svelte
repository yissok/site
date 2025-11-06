<script lang="ts">
  let {
    name,
  }: {
    name: string;
  } = $props();
</script>

<div>
  {#if name}
    <h1>
      {name}'s form
    </h1>
  {/if}
</div>

<style></style>
