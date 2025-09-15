import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { collection, addDoc, getDocs, getDoc, setDoc, doc, runTransaction } from 'firebase/firestore';

function calculateElo(winner: number, looser: number): number {
  return 0; // placeholder, add ELO calculation logic here.
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      date,
      winner,
      loser,
      winnerScore,
      loserScore
    } = body;

    console.log('Received match data:', body);

    // Stores the Match in Firestore
    await addDoc(collection(db, 'matches'), {
      date,
      winner,
      loser,
      winnerScore,
      loserScore
    });

    // Update player elo and stats
    const winnerRef = doc(db, 'players', winner);
    const loserRef = doc(db, 'players', loser);

    await runTransaction(db, async (transaction) => {
      const winnerSnap = await transaction.get(winnerRef);
      const loserSnap = await transaction.get(loserRef);

      const winnerData = winnerSnap.exists() ? winnerSnap.data()  : { name: winner, wins: 0, losses: 0, elo: 1000 };
      const loserData = loserSnap.exists() ? loserSnap.data() : { name: loser, wins: 0, losses: 0, elo: 1000 };

      const newWinnerElo = calculateElo(winnerData.elo, loserData.elo);
      const newLoserElo = calculateElo(loserData.elo, winnerData.elo);

      transaction.set(winnerRef, {
        ...winnerData,
        wins: winnerData.wins + 1,
        elo: newWinnerElo
      });

      transaction.set(loserRef, {
        ...loserData,
        losses: loserData.losses + 1,
        elo: newLoserElo
      });
    });


    // Responses just for debugging
    return new Response(
      JSON.stringify({ success: true, message: 'Match created!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    } catch (error) {
      console.error('Error creating match:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error creating match', error: error?.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
  }
};

