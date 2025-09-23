// functions/getAvailableMonths.ts
import * as functions from "firebase-functions";
import corsLib from "cors";
import { db } from "./admin";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ region: 'europe-west1' });

const cors = corsLib({ origin: true });

export const getAvailableMonths = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      const snapshot = await db.collection("matches").get();

      const months = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.date?.toDate) {
          const d: Date = data.date.toDate();
          const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
          months.add(key);
        }
      });

      const sortedMonths = Array.from(months).sort((a, b) => {
        const [yearA, monthA] = a.split("-").map(Number);
        const [yearB, monthB] = b.split("-").map(Number);
        return yearB - yearA || monthB - monthA; 
      });

      res.status(200).json({ success: true, months: sortedMonths });
    } catch (error: any) {
      console.error("Error fetching months:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching months",
        error: error.message,
      });
    }
  });
});
