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

{#if checking}
  <div class="loading">Loading...</div>
{:else}
  <slot /> <!-- always render child page -->
{/if}
