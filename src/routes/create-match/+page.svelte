<script lang="ts">
  import Select from 'svelte-select';
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/flatpickr.css';
    import { onMount } from 'svelte';

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
      const res = await fetch('/api/create-match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: selectedDate,
        winner: selectedWinner?.value,
        loser: selectedLoser?.value,
        winnerScore,
        loserScore
      })
    });

    const data = await res.json();
    console.log('API response:', data);
  }

  onMount(() => {
    flatpickr(inputEl, {
      dateFormat: 'Y-m-d',
      onChange: ([date]) => {
        selectedDate = date.toISOString().split('T')[0];
      }
    });
  });
  
  let selectedDate = new Date().toISOString().split('T')[0];
  let inputEl: HTMLInputElement;
  let selectedWinner: player | null = null;
  let selectedLoser: player | null = null;
  let winnerScore: number | null = null;
  let loserScore: number | null = null;
</script>
<div class="column">
  <div class="phone-width">
    <h1>Create Match!</h1>

    <h3>Match Date</h3>
    <input class="phone-item" bind:this={inputEl} placeholder="Select date" />
    <h3>Winner</h3>
    <Select
    class="phone-item"
    items={players}
    bind:value={selectedWinner}
    placeholder="Search or select..."
    />
    <h3>Winner's Score</h3>
    <input class="phone-item" bind:value={winnerScore}>
    <h3>Loser</h3>
    <Select
    items={players}
    class="phone-item"
    bind:value={selectedLoser}
    placeholder="Search or select..."
    />
    <h3>Loser's score</h3>
    <input class="phone-item" bind:value={loserScore}>

    <a class="button" on:click={createMatch}>Create Match</a>

    <a class="button" href="/">Go Back</a>
  </div>
</div>

<style>
    .phone-width h3 {
      margin: 0;
    }
    .phone-item {
      width: 95%;
      border-color: #D8DBDF;
      border-style: solid;
      border-width: 1.5px;
      border-radius: .25rem;
      height: 2rem;
      margin: 1rem;
    }
    .phone-width {
        display: flex;
        flex-direction: column;
        gap: .5rem;
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