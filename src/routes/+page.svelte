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
      const res = await fetch("/api/gemini-response", {
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
