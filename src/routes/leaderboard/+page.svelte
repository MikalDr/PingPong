<script lang="ts">
  import type { Player } from "$lib/types/player";
  import { onMount } from "svelte";

  type PlayerWithDisplayName = Player & {
    first: string;
    lastInitial: string;
    displayName: string;
    rank: number;
  };

  let allPlayers: PlayerWithDisplayName[] = [];
  let displayPlayers: PlayerWithDisplayName[] = [];

  let sortBy: "rank" | "elo" | "winrate" = "rank";
  let sortAsc: boolean = false; // default descending

  onMount(async () => {
    try {
      const leaderboardData: Record<string, Player> = await fetch('/api/leaderboard').then(res => res.json());

      const sortedPlayers: Player[] = Object.values(leaderboardData).sort((a, b) => b.elo - a.elo);

      const parsedPlayers = sortedPlayers.map(player => {
        const [first, ...rest] = player.name.split(' ');
        const last = rest.at(-1) ?? '';
        return {
          ...player,
          first,
          lastInitial: last.charAt(0)
        };
      });

      const nameCounts: Record<string, number> = {};
      for (const p of parsedPlayers) {
        nameCounts[p.first] = (nameCounts[p.first] || 0) + 1;
      }

      allPlayers = parsedPlayers.map((p, idx) => {
        const displayName = nameCounts[p.first] > 1 ? `${p.first} ${p.lastInitial}.` : p.first;
        return {
          ...p,
          displayName,
          rank: idx + 1
        };
      });

      updateSort();
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  });

  function updateSort() {
    displayPlayers = [...allPlayers].sort((a, b) => {
      let result = 0;
      if (sortBy === "rank") {
        result = a.rank - b.rank;
      }
      if (sortBy === "elo") {
        result = a.elo - b.elo;
      }
      if (sortBy === "winrate") {
        const winRateA = a.wins + a.losses === 0 ? 0 : a.wins / (a.wins + a.losses);
        const winRateB = b.wins + b.losses === 0 ? 0 : b.wins / (b.wins + b.losses);
        result = winRateA - winRateB;
      }
      return sortAsc ? result : -result;
    });
  }

  function handleHeaderClick(key: "rank" | "elo" | "winrate") {
    if (sortBy === key) {
      sortAsc = !sortAsc;
    } else {
      sortBy = key;
      sortAsc = false;
    }
    updateSort();
  }
</script>

<div class="column">
  <h1>Leaderboard</h1>
  <div class="leaderboard">
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th on:click={() => handleHeaderClick("rank")}>
            Rank {sortBy === "rank" ? (sortAsc ? "↑" : "↓") : ""}
          </th>
          <th>Name</th>
          <th on:click={() => handleHeaderClick("elo")}>
            ELO {sortBy === "elo" ? (sortAsc ? "↑" : "↓") : ""}
          </th>
          <th>Wins</th>
          <th>Losses</th>
          <th on:click={() => handleHeaderClick("winrate")}>
            Win Rate {sortBy === "winrate" ? (sortAsc ? "↑" : "↓") : ""}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each displayPlayers as player}
          <tr>
            <td>{player.rank}</td>
            <td>{player.displayName}</td>
            <td>{player.elo}</td>
            <td>{player.wins}</td>
            <td>{player.losses}</td>
            <td>
              {player.wins + player.losses === 0 
                ? '0.00%' 
                : ((player.wins / (player.wins + player.losses)) * 100).toFixed(2) + '%'}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <a class="button" href="/">Go Back</a>
</div>

<style>
  .column {
    margin: 1rem;
  }
  .leaderboard{
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
    cursor: pointer;
    user-select: none;
  }
  .leaderboard-table th:hover {
    background-color: #e0e0e0;
  }
  .leaderboard-table thead {
    background-color: #f0f0f0;
    position: sticky;
    top: 0;
  }
</style>
