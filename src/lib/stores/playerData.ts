import { writable } from "svelte/store";

export type PlayerData = {
  name: string;
  rating: number;
  wins: number;
  losses: number;
  ranking: string;
};

export const playerData = writable<PlayerData | null>(null);
export const aiResponse = writable<string>("");
