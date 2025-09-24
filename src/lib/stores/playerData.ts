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

let hasLoaded = false;

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
  } catch {
    return null;
  }
  return null;
}

async function fetchGeminiComment(name: string, rank: number): Promise<string> {
  try {
    const res = await fetch("/api/geminiResponse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: name, position: rank }),
    });
    const data: { comment?: string } = await res.json();
    return data.comment ?? "";
  } catch {
    return "";
  }
}

async function fetchPlayerRank(uid: string): Promise<number> {
  try {
    const res = await fetch("/api/leaderboard");
    const leaderboardData: Record<string, Player> = await res.json();

    const sortedPlayers = Object.values(leaderboardData).sort((a, b) => b.elo - a.elo);
    const parsedPlayers = sortedPlayers.map((p, idx) => ({ ...p, rank: idx + 1 }));

    const playerEntry = parsedPlayers.find((p) => p.uid === uid);
    return playerEntry?.rank ?? 0;
  } catch {
    return 0;
  }
}

export async function refreshPlayerData(uid: string, displayName: string | null, force = false): Promise<void> {
  if (hasLoaded && !force) return;

  const stats = await fetchPlayerStats(uid, displayName);
  playerData.set(stats);

  if (stats) {
    const rank = await fetchPlayerRank(uid);
    const comment = await fetchGeminiComment(stats.name, rank);
    aiResponse.set(comment);
  } else {
    aiResponse.set("");
  }

  hasLoaded = true;
}
