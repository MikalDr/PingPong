<script lang="ts">
  import { onMount } from "svelte";

  type eloChange = {
    WinnerElo: number;
    gain: number;
    LoserElo: number;
  };

  interface Match {
    date: string;
    winner: string;
    loser: string;
    winnerScore: number;
    loserScore: number;
    eloChange: eloChange;
  }

  interface MonthEntry {
    year: number;
    month: number;
  }

  let games: Match[] = [];
  let months: MonthEntry[] = [];
  let selectedMonth: string = "";

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const currentKey = `${currentYear}-${currentMonth}`;

  async function fetchMatches(year: number, month: number) {
    try {
      const res = await fetch(`/api/getMatches?month=${month}&year=${year}`);
      const data = await res.json();
      if (data.success) {
        games = data.matches;
        console.log("Fetched games:", games);
      } else {
        console.error("Error fetching games:", data);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  }

  onMount(async () => {
    await fetchMatches(currentYear, currentMonth);
    selectedMonth = currentKey;

    try {
      const res = await fetch("/api/getAvailableMonths");
      const data = await res.json();
      if (data.success) {
        months = data.months;
      }
    } catch (err) {
      console.error("Error fetching available months:", err);
    }
  });
</script>

<div class="column">
  <h1>All Games</h1>

  <div class="leaderboard">
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Winner</th>
          <th>ELO</th>
          <th>Loser</th>
          <th>ELO</th>
          <th>Winner Score</th>
          <th>Loser Score</th>
        </tr>
      </thead>
      <tbody>
        {#each games as game}
          <tr>
            <td>{game.date}</td>
            <td>{game.winner}</td>
            <td>{game.eloChange.WinnerElo} + {game.eloChange.gain}</td>
            <td>{game.loser}</td>
            <td>{game.eloChange.LoserElo} - {game.eloChange.gain}</td>
            <td>{game.winnerScore}</td>
            <td>{game.loserScore}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="column phone-width">
    <a class="button" href="/">Go Back</a>
  </div>
</div>

<style>
  .column {
    margin: 1rem;
  }
  .leaderboard {
    max-height: 70vh;
    overflow-y: auto;
    border: 1px solid #ccc;
    width: 100%;
    margin-bottom: 2rem;
  }
  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
  }
  .leaderboard-table th,
  .leaderboard-table td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: center;
  }

  .leaderboard-table thead {
    background-color: #f0f0f0;
    position: sticky;
    top: 0;
  }
</style>
