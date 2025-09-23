<script lang="ts">
  import { onMount } from "svelte";
  import { user } from "$lib/stores/user";
  import { auth } from "$lib/firebase";
  import { onAuthStateChanged } from "firebase/auth";

  let player = {
    name: "",
    rating: 1000,
    wins: 0,
    losses: 0,
    ranking: "0"
  };

  let ai_response = "";

  async function fetchPlayerStats(uid: string, displayName: string | null) {
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
  }

  async function fetchGeminiComment() {
    try {
      const res = await fetch("/api/geminiResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: player.name,
          position: player.ranking
        })
      });

      const data = await res.json();
      ai_response = data.comment ?? "";
    } catch (error) {
      console.error("Error fetching ai response:", error);
    }
  }

  async function loadPlayerData(uid: string, displayName: string | null) {
    await fetchPlayerStats(uid, displayName);
    await fetchGeminiComment();
  }

  onMount(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        user.set(firebaseUser);

        if (firebaseUser) {
          loadPlayerData(firebaseUser.uid, firebaseUser.displayName);
        } else {
          player = { name: "", rating: 1000, wins: 0, losses: 0, ranking: "0" };
          ai_response = "";
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
      <h3 class="fade-text">ELO:</h3>
      <h3>{player.rating}</h3>
      <h3 class="fade-text">Rank:</h3>
      <h3
        class:gold-text={player.ranking === "1"}
        class:silver-text={player.ranking === "2"}
        class:bronze-text={player.ranking === "3"}>
        #{player.ranking}
      </h3>
    </div>
    <div class="inline">
      <h3>W {player.wins}</h3>
      <h3>L {player.losses}</h3>
      <h3>
        {player.wins + player.losses > 0 
          ? (player.wins / (player.losses + player.wins) * 100).toFixed(1) 
          : 0}%
      </h3>
    </div>
  </div>

  <div class="button-column phone-width">
    <a class="button" href="/create-match">Create match</a>
    <a class="button" href="/leaderboard">Leaderboard</a>
    <a class="button" href="/games">All Games</a>
    <a class="button" href="/stats">Stats</a>

    {#if ai_response}
      <div class="speech-bubble pop">{ai_response}</div>
    {:else}
      <div class="speech-bubble typing">
        <span></span><span></span><span></span>
      </div>
    {/if}

  </div>

  <div class="bottom-text">
    <p class="info">Report issues or suggest features at</p>
    <a class="infolink" href="https://github.com/MikalDr/PingPong/issues">Github</a>
  </div>
</div>

<style>
  p { margin: 0; }
  .bottom-text {
    position: fixed;
    bottom: 1rem;    
    left: 50%;       
    transform: translateX(-50%);
    text-align: center;
    display: flex;
    flex-direction: column; 
    align-items: center;
    gap: 0.25rem;         
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
  }
  .info{ color: gray}
  .infolink{ color: lightblue}

  .speech-bubble {
  position: relative;
  background: #F07D00;
  border-radius: 1rem;
  padding: 1rem;
  margin-top: 1rem;
  max-width: 300px;
  font-style: italic;
  color: #ffffff;
}

.speech-bubble::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20px;
  width: 0;
  height: 0;
  border: 16px solid transparent;
  border-top-color: #F07D00;
  border-bottom: 0;
  margin-left: -6px;
  margin-bottom: -12px;
}

.speech-bubble.typing {
  position: relative;
  background: #F07D00;
  border-radius: 1rem;
  padding: 1rem;
  max-width: 300px;
  color: #fff;
  display: flex;
  justify-content: flex-start;
  gap: 12px; /* increased spacing between dots */
}

.speech-bubble.typing span {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: blink 1.4s infinite both;
}

.speech-bubble.typing span:nth-child(1) {
  animation-delay: 0s;
}
.speech-bubble.typing span:nth-child(2) {
  animation-delay: 0.2s;
}
.speech-bubble.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

.speech-bubble.typing span:nth-child(1) { animation-delay: 0s; }
.speech-bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
.speech-bubble.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}

@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  60% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.speech-bubble.pop {
  animation: popIn 0.3s ease-out;
}

</style>
