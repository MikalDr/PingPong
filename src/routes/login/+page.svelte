<script lang="ts">
  import { auth } from "$lib/firebase";
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

  async function loginWithGoogle() {
    if (!auth) return; // SSR safety
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
  }
</script>

<button on:click={loginWithGoogle} class="button">
  Login with Google
</button>