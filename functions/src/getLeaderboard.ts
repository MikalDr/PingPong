// functions/getLeaderboard.ts
import * as functions from "firebase-functions";
import corsLib from "cors";
import { db } from "./admin";

const cors = corsLib({ origin: true }); // allow all origins

export const getLeaderboard = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      const snapshot = await db.collection("players").get();

      const leaderboard: Record<string, any> = {};
      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        leaderboard[doc.id] = {
          uid: doc.id,
          name: data.name || "Unknown",
          wins: data.wins ?? 0,
          losses: data.losses ?? 0,
          elo: data.elo ?? 1000,
          rank: 0 // we'll assign ranks in frontend
        };
      });

      res.status(200).json(leaderboard);
    } catch (error: any) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});
