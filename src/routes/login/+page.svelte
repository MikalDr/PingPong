<script lang="ts">
  import { auth, db } from "$lib/firebase";
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { doc, getDoc, setDoc } from "firebase/firestore";

  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';

  onMount(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        goto('/'); // or dashboard
      }
    });
    return () => unsub();
  });

  async function loginWithGoogle() {
    if (!auth) return; // SSR safety

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in user:", user);

      if (!user) return;

      // Reference to player document
      const playerRef = doc(db, "players", user.uid);

      // Check if player already exists
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) {
        // Create player in Firestore
        await setDoc(playerRef, {
          name: user.displayName || "Unknown Player",
          email: user.email || "",
          wins: 0,
          losses: 0,
          elo: 1000,
          createdAt: new Date().toISOString()
        });
        console.log("Player document created in Firestore");
      } else {
        console.log("Player already exists");
      }

    } catch (error) {
      console.error("Login failed:", error);
    }
  }
</script>

<div class="column center">
  <h1>Login</h1>
  <p>Please login with Google to continue.</p>
  <button on:click={loginWithGoogle} class="button">
    Login with Google
  </button>
</div>

<style>
  .column {
    width: 100%;
  }
  .center {
    justify-content: center;
    align-items: center;
  }
  .button {
    width: 80%;
  }
</style>