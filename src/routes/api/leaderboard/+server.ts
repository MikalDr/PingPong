import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Player } from '$lib/types/player';

export const GET: RequestHandler = async ({ request }) => {
    try{
        const playersCol = collection(db, 'players');
        const playersQuery = query(playersCol, orderBy('elo', 'desc'));
        const playerSnapshot = await getDocs(playersQuery);
        const players = playerSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                wins: data.wins,
                losses: data.losses,
                elo: data.elo
            } as Player;
        });
        return new Response(JSON.stringify({success: true, players}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching players:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error fetching players' }), {    
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}