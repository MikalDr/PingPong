import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const { playerName, position } = await request.json();

  const apiKey = process.env.GEMINI_API_KEY;

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
}
