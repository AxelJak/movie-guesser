import { nanoid } from "nanoid";
import { Message } from "@/schema";

export function createMessage(message: string, roomID: string, senderID: string): Message {
  return {
    id: nanoid(),
    roomID,
    senderID,
    message,
    timestamp: new Date().getTime(),
  }
}