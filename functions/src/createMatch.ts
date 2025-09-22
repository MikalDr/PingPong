import * as functions from "firebase-functions";
import corsLib from "cors";
import { db } from "./admin";

const cors = corsLib({ origin: true });

type eloChange = {
  WinnerElo: number;
  gain: number;
  LoserElo: number;
}

function calculateElo(winnerElo: number, loserElo: number): { newWinnerElo: number; newLoserElo: number } {
  var k = 32;

  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));

  const newWinnerRating = winnerElo + Math.round(k * (1 - expectedWinner));
  const newLoserRating = loserElo + Math.round(k * (0 - expectedLoser));

  return {
    newWinnerElo: newWinnerRating,
    newLoserElo: newLoserRating,
  };
}

export const createMatch = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      const { date, winner, loser, winnerScore, loserScore } = req.body;

      await db.runTransaction(async (transaction) => {
        const winnerRef = db.collection("players").doc(winner);
        const loserRef = db.collection("players").doc(loser);

        const winnerDoc = await transaction.get(winnerRef);
        const loserDoc = await transaction.get(loserRef);

        if (!winnerDoc.exists || !loserDoc.exists) {
          throw new Error("Winner or loser not found");
        }

        const winnerData = winnerDoc.data()!;
        const loserData = loserDoc.data()!;

        const { newWinnerElo, newLoserElo } = calculateElo(
          winnerData.elo || 1000,
          loserData.elo || 1000
        );

        transaction.update(winnerRef, {
          wins: (winnerData.wins || 0) + 1,
          elo: newWinnerElo,
        });

        transaction.update(loserRef, {
          losses: (loserData.losses || 0) + 1,
          elo: newLoserElo,
        });

        var eloChange : eloChange = {
          WinnerElo: winnerData.elo,
          LoserElo: loserData.elo,
          gain: newWinnerElo - winnerData.elo,
        }

        transaction.set(db.collection("matches").doc(), {
          date: new Date(date),
          winner,
          loser,
          winnerScore,
          loserScore,
          eloChange
        });
      });

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});
