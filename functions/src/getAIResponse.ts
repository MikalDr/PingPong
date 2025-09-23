import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { playerName, position }: { playerName: string; position: number } = await request.json();

  const apiKey = process.env.VITE_GEMINI_API_KEY ?? '';

  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Write a sassy comment about ${playerName} being at position #${position} on the leaderboard. In Norwegian, under 15 words.`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await res.json();
  const comment = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  return json({ comment });
};
