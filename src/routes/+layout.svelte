<script lang="ts">
  import { onAuthStateChanged } from "firebase/auth";
  import { auth } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import "./global.css";

  let checking = true;
  let loggedIn = false;

  onMount(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      checking = false;
      if (user) {
        loggedIn = true;
      } else {
        loggedIn = false;
        if (window.location.pathname !== "/login") {
          goto("/login");
        }
      }
    });
    return () => unsub();
  });
</script>

<svelte:head>
  <title>Ping Pong</title>
  <link rel="icon" type="image/x-icon" href="/bordtennis.ico" />
  <link rel="icon" type="image/png" sizes="192x192" href="/bordtennis-192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/bordtennis-512.png" />
  <link rel="apple-touch-icon" href="/bordtennis-192.png" />
</svelte:head>

{#if checking}
  <div class="loading">Loading...</div>
{:else}
  <slot /> <!-- always render child page -->
{/if}
