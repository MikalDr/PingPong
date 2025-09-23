// functions/getMatches.ts
import * as functions from "firebase-functions";
import corsLib from "cors";
import { db } from "./admin";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ region: 'europe-west1' });
const cors = corsLib({ origin: true });

export const getMatches = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      const { month, year, player1, player2 } = req.query;

      let query: FirebaseFirestore.Query = db
        .collection("matches")
        .orderBy("date", "desc");

      if (month && year) {
        const monthNum = parseInt(month as string, 10);
        const yearNum = parseInt(year as string, 10);
        
        if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
          res.status(400).json({ success: false, message: "Invalid month or year" });
          return;
        }

        const start = new Date(yearNum, monthNum - 1, 1);
        const end = new Date(yearNum, monthNum, 1);
        
        query = query.where("date", ">=", start).where("date", "<", end);
      }

      if (player1 && !player2) {
        query = query.where("players", "array-contains", player1);
      } else if (player2 && !player1) {
        query = query.where("players", "array-contains", player2);
      } else if (player1 && player2) {
        query = query.where("players", "array-contains", player1);
      }

      const snapshot = await query.get();
      let matches = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const winnerDoc = await db.collection("players").doc(data.winner).get();
          const loserDoc = await db.collection("players").doc(data.loser).get();

          return {
            id: doc.id,
            date: data.date.toDate().toISOString().split("T")[0],
            winner: winnerDoc.data()?.name,
            loser: loserDoc.data()?.name,
            winnerScore: data.winnerScore,
            loserScore: data.loserScore,
            eloChange: data.eloChange,
            players: data.players
          };
        })
      );

      if (player1 && player2) {
        matches = matches.filter((m) => m.players.includes(player2 as string));
      }

      res.status(200).json({ success: true, matches });
    } catch (error: any) {
      console.error("Error fetching matches:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching matches",
        error: error.message,
      });
    }
  });
});