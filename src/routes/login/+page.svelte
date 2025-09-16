<script lang="ts">
  import { auth } from "$lib/firebase";
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in as:", user.displayName, user.email);
    } catch (err) {
      console.error("Login failed", err);
    }
  }
</script>

<button on:click={loginWithGoogle} class="button">
  Login with Google
</button>