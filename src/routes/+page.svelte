<script lang="ts">
    var player = {
        name: "Mikal",
        rating: "1100",
        wins: "9",
        losses: "1",
        ranking: "4"
    }
</script>

<div class="column">

    <h1>Ping Pong</h1>

    <div class="column profile">
        <h1>{player.name}</h1>
        <div class="inline">
            <h3 class="fade-text">ELO: </h3>
            <h3> {player.rating} </h3>
            <h3 class="fade-text">Rank:</h3>
            <h3
            class:gold-text={player.ranking === "1"}
            class:silver-text={player.ranking === "2"}
            class:bronze-text={player.ranking === "3"}
            >
            #{player.ranking}
            </h3>
        </div>
        <div class="inline">
            <h3>W {player.wins}</h3>
            <h3>L {player.losses}</h3>
            <h3>{(player.wins/(player.losses+player.wins)).toFixed(2)}%</h3>
        </div>
    </div>

    <div class="button-column">
        <a class="button" href="/create-match">Create match</a>
        <a class="button" href="/leaderboard">Leaderboard</a>
        <a class="button" href="/games">All Games</a>
        <a class="button" href="/stats">Stats</a>
    </div>
</div>

<style>
    .profile {
        border-bottom: rgb(223, 223, 223) 2px solid;
        width: 100%;
        height: auto;
        gap: 0;
        margin-bottom: 2rem;
    }
    .profile h3{
        margin: .5rem;
    }
    .profile h1{
        margin: .5rem;
    }
</style>