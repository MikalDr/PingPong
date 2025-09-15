import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Match } from '$lib/types/match';

export const GET: RequestHandler = async ({ request }) => {
    try{
        const matchesCol = collection(db, 'matches');

        const matchesQuery = query(matchesCol, orderBy('date', 'desc'));
        const matchSnapshot = await getDocs(matchesQuery);
        const matches = matchSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                date: data.date,
                winner: data.winner,
                loser: data.loser,
                winnerScore: data.winnerScore,
                loserScore: data.loserScore
            } as Match;
        });

        return new Response(JSON.stringify({success: true, matches}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching matches:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error fetching matches' }), {    
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}