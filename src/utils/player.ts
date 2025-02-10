import { Player } from "../schema";

export function createPlayer(id: string, player: string, roomId: string, isHost: boolean = false): Player {
  return {
    id: id,
    name: player,
    score: 0,
    roomID: roomId,
    isHost: isHost,
    created_at: new Date().getTime(),
  };
}