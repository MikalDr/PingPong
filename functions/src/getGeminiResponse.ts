import * as functions from "firebase-functions";
import { setGlobalOptions } from "firebase-functions/v2";
import corsLib from "cors";

setGlobalOptions({ region: 'europe-west1' });

const cors = corsLib({ origin: true });

export const geminiResponse = functions
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      const { playerName, position } = req.body;

      if (!playerName || position === undefined) {
        res.status(400).json({ error: "Missing playerName or position" });
        return;
      }

      const apiKey = "AIzaSyCQdw-DDOWXtsJoHKWUhtL9M1-MlgramKs";
      if (!apiKey) {
        res.status(500).json({ error: "Server API key not configured" });
        return;
      }

      const geminiRes = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Write a sassy comment about ${playerName} being at position #${position} on the leaderboard. In Norwegian, under 15 words.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        console.error("Gemini API error:", errorText);
        res.status(502).json({ error: "Failed to generate comment" });
        return;
      }

      const data = await geminiRes.json();
      const comment =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      res.json({ comment });
    } catch (err) {
      console.error("Function error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
    });
  });
