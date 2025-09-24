import { writable } from "svelte/store";
import type { Player } from "$lib/types/player";

export interface PlayerData {
  name: string;
  rating: number;
  wins: number;
  losses: number;
}

export const playerData = writable<PlayerData | null>(null);
export const aiResponse = writable<string>("");

async function fetchPlayerStats(uid: string, displayName: string | null): Promise<PlayerData | null> {
  try {
    const res = await fetch(`/api/playerStats?uid=${uid}`);
    const data: { success: boolean; player?: Player } = await res.json();

    if (data.success && data.player) {
      return {
        name: data.player.name || displayName || "Unknown",
        rating: data.player.elo,
        wins: data.player.wins,
        losses: data.player.losses,
      };
    }
  } catch (err) {
    console.error("Error fetching player stats:", err);
  }
  return null;
}

async function fetchGeminiComment(name: string): Promise<string> {
  try {
    const res = await fetch("/api/geminiResponse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: name }),
    });
    const data: { comment?: string } = await res.json();
    return data.comment ?? "";
  } catch (err) {
    console.error("Error fetching AI response:", err);
    return "";
  }
}

export async function refreshPlayerData(uid: string, displayName: string | null): Promise<void> {
  const stats = await fetchPlayerStats(uid, displayName);
  playerData.set(stats);

  if (stats) {
    const comment = await fetchGeminiComment(stats.name);
    aiResponse.set(comment);
  } else {
    aiResponse.set("");
  }
}
