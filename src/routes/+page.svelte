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

  {#if $playerData}
    <div class="column profile">
      <h1>{$playerData.name}</h1>
      <div class="inline">
        <h3 class="fade-text">ELO:</h3>
        <h3>{$playerData.rating}</h3>
      </div>
      <div class="inline">
        <h3>W {$playerData.wins}</h3>
        <h3>L {$playerData.losses}</h3>
        <h3>
          {$playerData.wins + $playerData.losses > 0 
            ? (($playerData.wins / ($playerData.wins + $playerData.losses)) * 100).toFixed(1) 
            : 0}%
        </h3>
      </div>
    </div>

    {#if $aiResponse}
      <div class="speech-bubble pop">{$aiResponse}</div>
    {:else}
      <div class="speech-bubble typing">
        <span></span><span></span><span></span>
      </div>
    {/if}
  {:else}
    <p>Loading player...</p>
  {/if}

  <div class="button-column phone-width">
    <a class="button" href="/create-match">Create match</a>
    <a class="button" href="/leaderboard">Leaderboard</a>
    <a class="button" href="/games">All Games</a>
    <a class="button" href="/stats">Stats</a>
  </div>

  <div class="bottom-text">
    <p class="info">Report issues or suggest features at</p>
    <a class="infolink" href="https://github.com/MikalDr/PingPong/issues">Github</a>
  </div>
</div>
