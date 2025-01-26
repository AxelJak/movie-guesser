import { Player } from "../schema";
import { randID } from "./rand";

export function createPlayer(player: string, roomId: string): Player {
  return {
    id: randID(),
    name: player,
    score: 0,
    roomID: roomId,
  };
}