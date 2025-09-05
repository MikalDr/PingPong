import type { RequestHandler } from '@sveltejs/kit';

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

    // Implement Logic:
    // Needs to create a match
    // Needs to update ELO of Winner and Loser
    // Needs to update ranking

    console.log('Match data received:', { date, winner, loser, winnerScore, loserScore });

    return new Response(
      JSON.stringify({ success: true, message: 'Match created!' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error parsing match data:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid request data' }),
      { status: 400 }
    );
  }
};
