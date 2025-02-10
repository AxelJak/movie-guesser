import { GameState } from "@/schema";

// // Game logic hook to:
// - Manage game state
// - Handle turns
// - Track scores
// - Manage timer 

export function createGame(id: string, roomId: string): GameState {
  // Create game state
  return {
    id: id,
    roomID: roomId,
    currentRound: 0,
    currentPlayerExplaining: null,
    gameStatus: "waiting",
    startedAt: null,
    endedAt: null
  };
  }