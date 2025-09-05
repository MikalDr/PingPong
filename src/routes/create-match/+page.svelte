<script lang="ts">
  import Select from 'svelte-select';
  import { onMount } from "svelte";
  import { page } from '$app/stores';

  type player = {
    label: string,
    value: string
  }

  let players = [
    { label: "Benjamin", value: "apple" },
    { label: "Vegard", value: "banana" },
    { label: "Mikal", value: "orange" }
  ];

  // This will query the defined create-match API, defined in api/create-match/+server.ts
  async function createMatch() {
    const res = await fetch(`/api/create-match`);
  }

  let selectedDate: string = ""; // ISO date string, e.g. "2025-09-04"
  let selectedWinner: player | null = null;
  let selectedLoser: player | null = null;
  let winnerScore: number | null = null;
  let loserScore: number | null = null;
</script>
<div class="column">
  <div class="phone-width">
    <h1>Create Match!</h1>

    Match Date
    <input class="phone-item" type="date" bind:value={selectedDate} />
    <p>Selected: {selectedDate}</p>
    Winner
    <Select
    class="phone-item"
    items={players}
    bind:value={selectedWinner}
    placeholder="Search or select..."
    />
    Winner's Score
    <input class="phone-item" bind:value={winnerScore}>
    Loser
    <Select
    items={players}
    class="phone-item"
    bind:value={selectedLoser}
    placeholder="Search or select..."
    />
    Loser's score
    <input class="phone-item" bind:value={loserScore}>

    <a class="button" on:click={createMatch}>Create Match</a>

    <a class="button" href="/">Go Back</a>
  </div>
</div>

<style>
    .phone-item {
      width: 95%;
      border-color: #D8DBDF;
      border-style: solid;
      border-width: 1.5px;
      border-radius: .25rem;
      height: 2rem;
      margin: padding 2rem;
    }
    .phone-width {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        align-items: center;
        width: 80%;
    }
    @media (min-width: 768px) {
      .phone-width {
        width: 20rem;
      }
    }
</style>