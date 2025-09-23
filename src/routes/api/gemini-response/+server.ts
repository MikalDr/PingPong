import { json } from '@sveltejs/kit';

interface GenerateCommentRequest {
  playerName: string;
  position: number;
}

interface GenerateCommentResponse {
  comment?: string;
  error?: string;
}

export async function POST(event: { request: Request }) {
  try {
    const body: GenerateCommentRequest = await event.request.json();

    const { playerName, position } = body;

    if (!playerName || position === undefined) {
      const response: GenerateCommentResponse = { error: 'Missing playerName or position' };
      return json(response, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const response: GenerateCommentResponse = { error: 'Server API key not configured' };
      return json(response, { status: 500 });
    }

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey
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

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API error:', errorText);
      const response: GenerateCommentResponse = { error: 'Failed to generate comment' };
      return json(response, { status: 502 });
    }

    const data = await res.json();
    const comment = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const response: GenerateCommentResponse = { comment };
    return json(response);
  } catch (err) {
    console.error('Request error:', err);
    const response: GenerateCommentResponse = { error: 'Internal server error' };
    return json(response, { status: 500 });
  }
}
