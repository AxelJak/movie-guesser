import { useState, useEffect } from 'react';
import { useZero, useQuery } from "@rocicorp/zero/react";
import { useLocation } from "wouter";
import { Schema } from "../schema";
import { useCookies } from "react-cookie";
import { createGuess } from "../utils/guess";
import PlayersList from "./PlayersList";
import Input from "./Input";
import Settings from "./room/Settings";

export default function GameRoom({ roomKey }: { roomKey: string }) {
  const [cookies] = useCookies(["playerId"]);
  const [_, navigate] = useLocation();

  const z = useZero<Schema>();
  const [guess, setGuess] = useState("");
  const [settings, setSettings] = useState({});

  const rooms = z.query.room;
  const guesses = z.query.guess;

  const [room] = useQuery(rooms.where("room_key", roomKey).one().related('settings', (settings) => settings.one()).related('players'));

  useEffect(() => {
    if (room && room.settings) {
      setSettings(room.settings);
    }
  }, [room, settings]);

  const guessQuery = guesses.related("sender", (sender) => sender.one())
                          .where("roomID", room?.id ?? '')
                          .orderBy("timestamp", 'asc')
  const [guessesByRoom] = useQuery(guessQuery);
  const currentPlayer = room?.players.find((player) => player.id === cookies.playerId);


  function submitGuess() {
    if (!room || !guess) return;
    z.mutate.guess.insert(createGuess(guess, room.id, cookies.playerId));
    setGuess(""); // Clear input after submission
  }

  if (!room) {
    return (
      <div>
        <button onClick={() => navigate("/")}>
          Back
        </button>
        <span>Room not found</span>
      </div>
    );
  }

  return (
    <div>
      <button className="absolute left-20 top-20" onClick={() => navigate("/")}>
        Back
      </button>
      <div className="flex gap-2">
        <PlayersList roomPlayers={room.players} />
        <div className="flex flex-col gap-2" >
          <span className="text-3xl font-bold">Room {room.room_key}</span>
          {guessesByRoom.map((guess) =>
            <span key={guess.id} className="text-l">
              {`${guess.sender?.name}: ${guess.guess}`}
            </span>
          )}
          <Input 
            type="text" 
            value={guess}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                submitGuess();
              }
            }}
            onChange={(e: any) => setGuess(e.target.value)} 
            />
          <button onClick={submitGuess}>Submit</button>
        </div>
        {currentPlayer?.isHost && Object.keys(settings).length > 0 && (
            <Settings roomSettings={settings} />
        )}
      </div>
    </div>
  );
}