import { nanoid } from "nanoid";

export function createSettings(roomID: string, rounds: number = 10, time: number = 60, players: number = 4) {
  return {
    id: nanoid(),
    roomID,
    rounds,
    time,
    players,
  };
}
