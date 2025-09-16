<script lang="ts">
    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import { auth } from "$lib/firebase";
    import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
    import { onAuthStateChanged } from "firebase/auth";

    const db = auth ? getFirestore(auth.app) : undefined;

    let player = {
    name: "",
    rating: 1100,
    wins: 0,
    losses: 0,
    ranking: "0"
    };

    let matches: any[] = [];

    $: if ($user) {
        player.name = $user.displayName ?? "";

        (async () => {
            try {
            if (!db) return;

            const q1 = query(collection(db, "matches"), where("player1", "==", $user.uid));
            const q2 = query(collection(db, "matches"), where("player2", "==", $user.uid));

            const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

            matches = [
                ...snap1.docs.map(doc => doc.data()),
                ...snap2.docs.map(doc => doc.data())
            ];

            player.wins = matches.filter(m => m.winner === $user.uid).length;
            player.losses = matches.length - player.wins;

            } catch (err) {
            console.error("Error fetching matches:", err);
            }
        })();
    }

    onMount(() => {
    if (auth) {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            user.set(firebaseUser || null);
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
            <h3> {player.rating} </h3>
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
            <h3>{(player.wins/(player.losses+player.wins)).toFixed(2)}%</h3>
        </div>
    </div>

    <div class="button-column">
        <a class="button" href="/create-match">Create match</a>
        <a class="button" href="/leaderboard">Leaderboard</a>
        <a class="button" href="/games">All Games</a>
        <a class="button" href="/stats">Stats</a>
    </div>
</div>

<style>
    .profile {
        border-bottom: rgb(223, 223, 223) 2px solid;
        width: 100%;
        height: auto;
        gap: 0;
        margin-bottom: 2rem;
    }
    .profile h3{
        margin: .5rem;
    }
    .profile h1{
        margin: .5rem;
    }
</style>