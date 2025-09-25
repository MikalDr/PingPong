<script lang="ts">
  import { onMount } from "svelte";
  import { playerData, aiResponse, refreshPlayerData } from "$lib/stores/playerData";
  import { auth } from "$lib/firebase";
  import { onAuthStateChanged } from "firebase/auth";

  onMount(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          refreshPlayerData(firebaseUser.uid, firebaseUser.displayName);
        } else {
          playerData.set(null);
          aiResponse.set("");
        }
      });
      return () => unsubscribe();
    }
  });
</script>

<div class="column">
  <h1>Ping Pong</h1>

  <div class="profile-wrapper">
    {#if $playerData}
      <div class="profile-row">
        {#if $playerData?.photoURL}
          <img src="{$playerData.photoURL}" alt="Profile Picture" class="profile-pic" />
        {/if}
        <div class="stats-column">
          <div class="stat-row">
            <span class="stat-label">{$playerData.name}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">ELO:</span>
            <span class="stat-value">{$playerData.rating}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">W:</span>
            <span class="stat-value">{$playerData.wins}</span>
            <span class="stat-label">L:</span>
            <span class="stat-value">{$playerData.losses}</span>
            <span class="stat-label">Win%:</span>
            <span class="stat-value">
              {$playerData.wins + $playerData.losses > 0
                ? (($playerData.wins / ($playerData.wins + $playerData.losses)) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
      </div>

    {:else}
      <p>Loading player...</p>
    {/if}
  </div>


  <div class="button-column phone-width">
    <a class="button" href="/create-match">Create match</a>
    <a class="button" href="/leaderboard">Leaderboard</a>
    <a class="button" href="/games">All Games</a>
    <a class="button" href="/stats">Stats</a>

    {#if $aiResponse}
      <div class="speech-bubble pop">{$aiResponse}</div>
    {:else}
      <div class="speech-bubble typing"><span></span><span></span><span></span></div>
    {/if}
  </div>

  <div class="bottom-text">
    <p class="info">Report issues or suggest features at</p>
    <a class="infolink" href="https://github.com/MikalDr/PingPong/issues">Github</a>
  </div>
</div>


<style>
  .profile-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 3rem;
    width: 100%;
    border-bottom: 2px solid gray;
  }

  .profile-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .profile-pic {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }

  .stats-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
  }

  .stat-row {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }

  .stat-label {
    font-weight: bold;
  }

  .stat-value {
    min-width: 40px;
    text-align: right;
  }

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
  gap: 12px;
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
