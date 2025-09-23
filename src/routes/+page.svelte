<script lang="ts">
  import { onMount } from "svelte";
  import { user } from "$lib/stores/user";
  import { auth, db } from "$lib/firebase";
  import { onAuthStateChanged } from "firebase/auth";
  import { doc, getDoc } from "firebase/firestore";

  let player = {
    name: "",
    rating: 1000,
    wins: 0,
    losses: 0,
    ranking: "0"
  };

  let ai_response = "";

  async function loadPlayerData(uid: string, displayName: string | null) {
  try {
    const res = await fetch(`/api/playerStats?uid=${uid}`);
    const data = await res.json();

    if (data.success && data.player) {
      player.name = data.player.name || displayName || "Unknown";
      player.rating = data.player.elo;
      player.wins = data.player.wins;
      player.losses = data.player.losses;
      player.ranking = data.player.rank.toString();
    }
  } catch (err) {
    console.error("Error fetching player stats:", err);
  }
  
  try {
    const res = await fetch('/api/geminiResponse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerName: player.name,
      position: player.ranking
    })
    });

    const data = await res.json();
    ai_response = data.comment;

  } catch (error) {
    console.error("Error fetching ai response:", error);
  }
}

  onMount(() => {
  if (auth) {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      user.set(firebaseUser);

      if (firebaseUser) {
        loadPlayerData(firebaseUser.uid, firebaseUser.displayName);
      } else {
        player = {
          name: "",
          rating: 1000,
          wins: 0,
          losses: 0,
          ranking: "0"
        };
      }
    });
    return () => unsubscribe();
  }
  return () => {};
});
</script>


<div class="column">
  <h1>Ping Pong</h1>

  <div class="column profile">
    <h1>{player.name}</h1>
    <div class="inline">
      <h3 class="fade-text">ELO: </h3>
      <h3>{player.rating}</h3>
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
      <h3>{player.wins + player.losses > 0 
        ? (player.wins / (player.losses + player.wins) * 100).toFixed(1) 
        : 0}%</h3>
    </div>
  </div>

  <div class="button-column phone-width">
    <a class="button" href="/create-match">Create match</a>
    <a class="button" href="/leaderboard">Leaderboard</a>
    <a class="button" href="/games">All Games</a>
    <a class="button" href="/stats">Stats</a>
    <p>{ai_response}</p>
  </div>

  <div class= "spacer"></div>
  <p>Report issues or suggest features at</p>
  <a href="https://github.com/MikalDr/PingPong/issues">Github</a>
</div>

<style>
  p {
    margin:0;
  }
  .spacer {
    height: 2rem;
  }
</style>
