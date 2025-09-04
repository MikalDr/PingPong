<script lang="ts">
  import Select from 'svelte-select';

  type player = {
    label: string,
    value: string
  }

  let players = [
    { label: "Benjamin", value: "apple" },
    { label: "Vegard", value: "banana" },
    { label: "Mikal", value: "orange" }
  ];

  let selectedDate: string = ""; // ISO date string, e.g. "2025-09-04"
  let selectedWinner: player | null = null;
  let selectedLoser: player | null = null;
</script>
<div class="column">
    <h1>Create Match!</h1>

    Match Date
    <input class="phone-width" type="date" bind:value={selectedDate} />
    <p>Selected: {selectedDate}</p>
    Winner
    <Select
    class="phone-width"
    items={players}
    bind:value={selectedWinner}
    placeholder="Search or select..."
    />
    Winner's Score
    <input class="phone-width">
    Loser
    <Select
    class="phone-width"
    items={players}
    bind:value={selectedLoser}
    placeholder="Search or select..."
    />
    Loser's score
    <input class="phone-width">

    <a class="button">Create Match</a>

    <a class="button" href="/">Go Back</a>
</div>

<style>
    .phone-width {
        width: 70%;
    }
</style>