<script lang="ts">
  import Select from 'svelte-select';
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/flatpickr.css';
  import { launchConfetti } from "$lib/utils/confetti";
  import { onMount } from 'svelte';
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '$lib/firebase';
  import { auth } from '$lib/firebase';

  type Player = { label: string; value: string; };

  let players: Player[] = [];
  let filteredLosers: Player[] = [];

  let selectedDate: string;
  let inputEl: HTMLInputElement;
  let selectedWinner: Player | null = null;
  let selectedLoser: Player | null = null;
  let winnerScore: number | null = null;
  let loserScore: number | null = null;

  var statusMessage = "";
  let statusColor = "";

  const API_URL = "/api/createMatch";

  async function fetchPlayers() {
    const querySnapshot = await getDocs(collection(db, 'players'));
    players = querySnapshot.docs.map(doc => ({
      label: doc.data().name,
      value: doc.id
    }));

    if (players.length === 0) {
      players = [{ label: 'Test Player', value: 'test_player' }];
    }
  }

  $: filteredLosers = players.filter(p => selectedWinner ? p.value !== selectedWinner.value : true);

  async function createMatch() {
    if (!selectedWinner || !selectedLoser || winnerScore === null || loserScore === null || !selectedDate) {
      statusMessage = "Please fill in all fields!";
      statusColor = "red";
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          winner: selectedWinner.value,
          loser: selectedLoser.value,
          winnerScore,
          loserScore
        })
      });

      const data = await res.json();
      console.log('API response:', data);

      if (data.success) {
        const currentUserId = auth.currentUser?.uid;
        if (selectedWinner?.value === currentUserId) {
          launchConfetti();
        }

        statusMessage = "Match successfully created!";
        statusColor = "green";
        // Reset form
        selectedWinner = null;
        selectedLoser = null;
        winnerScore = null;
        loserScore = null;
        selectedDate = new Date().toISOString();
      } else {
        statusMessage = "Error creating match: " + data.error;
        statusColor = "red";
      }
    } catch (error: any) {
      console.error(error);
      statusMessage = "Error creating match: " + error.message;
      statusColor = "red";
    }
  }

  onMount(async () => {
    await fetchPlayers();

    selectedDate = new Date().toISOString();

    flatpickr(inputEl, {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      defaultDate: new Date(),
      onChange: ([date]) => {
        selectedDate = date.toISOString();
      }
    });
  });
</script>

<div class="column">
  <div class="phone-width">
    <h1>Create Match!</h1>
    <p style="color: {statusColor}">{statusMessage}</p>
    <h3>Match Date & Time</h3>
    <input class="phone-item" bind:this={inputEl} placeholder="Select date and time" />

    <h3>Winner</h3>
    <Select
      class="phone-item"
      items={players}
      bind:value={selectedWinner}
      placeholder="Select winner"
    />

    <h3>Winner's Score</h3>
    <input class="phone-item" type="number"
      bind:value={winnerScore} 
      on:input={(e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        const digits = target.value.replace(/\D/g, '');
        target.value = digits;
        winnerScore = digits ? Number(digits) : null;
      }}
    />

    <h3>Loser</h3>
    <Select
      class="phone-item"
      items={filteredLosers}
      bind:value={selectedLoser}
      placeholder="Select loser"
    />

    <h3>Loser's Score</h3>
    <input class="phone-item" type="number" 
      bind:value={loserScore}
      on:input={(e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        const digits = target.value.replace(/\D/g, '');
        target.value = digits;
        winnerScore = digits ? Number(digits) : null;
      }}
    />

    <button class="button" type="button" on:click={createMatch}>Create Match</button>
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
  @media (min-width: 768px) {
    .phone-width {
      width: 20rem;
    }
  }
</style>
