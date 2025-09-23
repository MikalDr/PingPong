// functions/getPlayerStats.ts
import * as functions from "firebase-functions";
import { db } from "./admin";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ region: 'europe-west1' });

export const getPlayerStats = functions.https.onRequest(async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid || typeof uid !== "string") {
      res.status(400).json({ success: false, error: "Missing uid" });
      return;
    }

    const playerDoc = await db.collection("players").doc(uid).get();
    if (!playerDoc.exists) {
      res.status(404).json({ success: false, error: "Player not found" });
      return;
    }

    const playerData = playerDoc.data();
    const elo = playerData?.elo ?? 1000;

    // Count how many players have higher elo → rank = count+1
    const higherRanked = await db
      .collection("players")
      .where("elo", ">", elo)
      .get();

    const rank = higherRanked.size + 1;

    res.json({
      success: true,
      player: {
        id: uid,
        name: playerData?.name ?? "Unknown",
        elo,
        wins: playerData?.wins ?? 0,
        losses: playerData?.losses ?? 0,
        rank,
      },
    });
  } catch (err: any) {
    console.error("Error in getPlayerStats:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
