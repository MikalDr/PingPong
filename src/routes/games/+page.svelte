<script lang="ts">
    import { onMount } from "svelte";

    let games: Match[] = [];

    onMount(async () => {
        try {
            const res = await fetch('/api/games');
            const data = await res.json();
            games = data;
            console.log('Fetched games:', data);
        } catch (err) {
            console.error('Error fetching games:', err);
        }
    });

 interface Match {
  date: string;
  winner: string;
  loser: string;
  winnerScore: number;
  loserScore: number;
}
</script>

<div class="column">
    <h1>All Games</h1>
    <div class="leaderboard">
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Winner</th> 
                    <th>Loser</th>
                    <th>Winner Score</th>
                    <th>Loser Score</th>
                </tr>
            </thead>
            <tbody>
                {#each games as game}
                    <tr>
                        <td>{game.date}</td>
                        <td>{game.winner}</td>
                        <td>{game.loser}</td>
                        <td>{game.winnerScore}</td>
                        <td>{game.loserScore}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="column">
        <a class="button" href="/">Go Back</a>
    </div>

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
    }

    .leaderboard-table thead {
        background-color: #f0f0f0;
        position: sticky;
        top: 0;
    }
</style>