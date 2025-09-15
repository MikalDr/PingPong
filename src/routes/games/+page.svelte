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

<div class="coulmn">
    <h1>All Games</h1>
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
    <div class="column">
        <a class="button" href="/">Go Back</a>
    </div>

</div>