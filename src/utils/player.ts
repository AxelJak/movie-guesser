import { Player } from "../schema";
import { randID } from "./rand";

export function createPlayer(player: string, roomId: string, isHost: boolean = false): Player {
  return {
    id: randID(),
    name: player,
    score: 0,
    roomID: roomId,
    isHost: isHost,
  };
}