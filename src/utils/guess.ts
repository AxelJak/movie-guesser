import { randID } from "./rand";
import { Guess } from "../schema";

export function createGuess(guess: string, roomKey: string, senderID: string): Guess {
  return {
    id: randID(),
    senderID: senderID,
    roomID: roomKey,
    guess,
    timestamp: new Date().getTime(),
  };
}