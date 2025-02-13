import { randID } from "./rand";
import { Guess } from "../schema";

export function createGuess(guess: string, roomId: string, senderID: string): Guess {
  return {
    id: randID(),
    senderID: senderID,
    roomID: roomId,
    guess,
    timestamp: new Date().getTime(),
  };
}