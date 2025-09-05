<script lang="ts">
    type Player = {
		name: string;
		wins: number;
		losses: number;
		rank: number;
	};

	type PlayerWithDisplayName = Player & {
		first: string;
		lastInitial: string;
		displayName: string;
	};

    var leaderboard = {
        1: {
            name: "Benjamin Mulelid Godø",
            wins: 10,
            losses: 3,
            rank: 1
        },
        2: {
            name: "Vegard Aalstad Vasset",
            wins: 12,
            losses: 6,
            rank: 2
        },
        4: {
            name: "Vegard Dæmring",
            wins: 0,
            losses: 0,
            rank: 4
        },
        3: {
            name: "Mikal Drivenes",
            wins: 10,
            losses: 6,
            rank: 3
        }
    }

    const sortedPlayers: Player[] = Object.values(leaderboard).sort((a, b) => a.rank - b.rank);

    const parsedPlayers: (Player & { first: string; lastInitial: string })[] = sortedPlayers.map(player => {
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

	const displayPlayers: PlayerWithDisplayName[] = parsedPlayers.map(p => {
		const displayName = nameCounts[p.first] > 1 ? `${p.first} ${p.lastInitial}.` : p.first;
		return {
			...p,
			displayName
		};
	});
    
    </script>

<div class="column">
    <h1>Leaderboard</h1>
    <div class="leaderboard">
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Win Rate</th>
                </tr>
            </thead>
            <tbody>
                {#each displayPlayers  as player}
                    <tr>
                        <td>{player.rank}</td>
                        <td>{player.displayName}</td>
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
    }

    .leaderboard-table thead {
        background-color: #f0f0f0;
        position: sticky;
        top: 0;
    }
</style>