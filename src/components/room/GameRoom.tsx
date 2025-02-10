import { useState, useEffect } from 'react';
import { useZero, useQuery } from "@rocicorp/zero/react";
import { useLocation } from "wouter";
import { Schema } from "@/schema";
import { createGuess } from "@/utils/guess";
import PlayersList from "@/components/PlayersList";
import { Input } from "@/components/ui/input";
import Settings from "@/components/room/Settings";
import { useCookies } from 'react-cookie';

export default function GameRoom({ roomKey, setPlayerJoined }: { roomKey: string, setPlayerJoined: any }) {
  const [_, navigate] = useLocation(); 

  const z = useZero<Schema>();
  const [guess, setGuess] = useState("");
  const [settings, setSettings] = useState({});
  const [cookies] = useCookies(["playerId"]);
  const [playerId, setPlayerId] = useState<string>('');
  
  const rooms = z.query.room;
  const guesses = z.query.guess;

  const [room, roomResult] = useQuery(rooms.where("room_key", roomKey).one().related('settings', (settings) => settings.one()).related('players'));

  useEffect(() => {
    if (room && room.settings) {
      setSettings(room.settings);
    }
  }, [room, settings]);

  
  const guessQuery = guesses.related("sender", (sender) => sender.one())
  .where("roomID", room?.id ?? '')
  .orderBy("timestamp", 'asc')
  const [guessesByRoom] = useQuery(guessQuery);
  const currentPlayer = room?.players.find((player) => player.id === playerId);
  
  useEffect(() => {
    if(cookies.playerId){
      setPlayerId(cookies.playerId);
    }
    if (room && roomResult.type === 'complete' && !room.players.find((player) => player.id === playerId)) {
      setPlayerJoined(false);
    }
    if (!cookies.playerId) {
      z.mutate.player.update({
        id: playerId,
        roomID: null,
      });
      setPlayerJoined(false);
    }
  }, [cookies, roomResult]);
  
  function submitGuess() {
    if (!room || !guess) return;
    z.mutate.guess.insert(createGuess(guess, room.id, cookies.playerId));
    setGuess(""); // Clear input after submission
  }

  function leaveRoom() {
    if(playerId) {
      z.mutate.player.update({
        id: playerId,
        roomID: null,
      });
    }
    navigate("/");
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
      <button className="absolute left-20 top-20" onClick={() => leaveRoom()}>
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