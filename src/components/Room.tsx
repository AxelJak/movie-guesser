import { useState, useEffect } from 'react';
import { useZero, useQuery } from "@rocicorp/zero/react";
import { useParams, useLocation } from "wouter";
import { Schema } from "../schema";
import { useCookies } from "react-cookie";
import { createGuess } from "../utils/guess";
import { createPlayer } from "../utils/player";
import PlayersList from "./PlayersList";
import Input from "./Input";
import Settings from "./room/Settings";

export default function Room() {
  const params = useParams();
  const roomKey = params[0] ?? ''; // Assuming wouter returns an array
  const [cookies, setCookie] = useCookies(["playerId"]);
  const [_, navigate] = useLocation();

  const z = useZero<Schema>();
  const [guess, setGuess] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState<string>("");

  const rooms = z.query.room;
  const players = z.query.player;
  const guesses = z.query.guess;

  const [room] = useQuery(rooms.where("room_key", roomKey).one());
  
  useEffect(() => {
    if (room) {
      setRoomId(room.id);
    }
  }, [room]);

  const guessQuery = guesses.related("sender", (sender) => sender.one())
                          .where("roomID", roomId)
                          .orderBy("timestamp", 'asc')
  const [guessesByRoom] = useQuery(guessQuery);
  const [roomPlayers] = useQuery(players.where("roomID", roomId));
  const currentPlayer = roomPlayers.find((player) => player.id === cookies.playerId);
  console.log(roomPlayers);

  function insertPlayer() {
    if (!room || !playerName) return;
    const isHost = roomPlayers.length === 0;
    const createdPlayer = createPlayer(playerName, room.id, isHost);
    z.mutate.player.insert(createdPlayer);
    setCookie("playerId", createdPlayer.id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 5) });
  }

  function submitGuess() {
    if (!roomId || !guess) return;
    z.mutate.guess.insert(createGuess(guess, roomId, cookies.playerId));
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

  if (!roomPlayers.find((player) => player.id === cookies.playerId)) {
    return (
      <div>
        <button className="absolute left-20 top-20" onClick={() => navigate("/")}>
          Back
        </button>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold">Room {room.room_key}</span>
          <span>You are not in this room</span>
        <Input 
          placeholder="Player name" 
          value={playerName}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              insertPlayer();
            }
          }}
          onChange={(e: any) => setPlayerName(e.target.value)} 
        />
        <button onClick={insertPlayer}>Create player</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="absolute left-20 top-20" onClick={() => navigate("/")}>
        Back
      </button>
      <div className="flex gap-2">
        <PlayersList roomPlayers={roomPlayers} />
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
        {currentPlayer?.isHost && (
          <Settings roomId={roomId} isHost={true} />
        )}
      </div>
    </div>
  );
}