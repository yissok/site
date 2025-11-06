<script lang="ts">
</script>

<details class="details-container">
    <summary>Filters:</summary>
    <div class="scrollable-container">
        <div>
            <label>
                <input type="checkbox" checked />
                "show direct coaches"
            </label>
        </div>
        <div>
            <label>
                <input type="checkbox" checked />
                "show coaches with intermediate stops"
            </label>
        </div>
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
    label {
        display: inline-flex;
        align-items: center;
    }
</style>
