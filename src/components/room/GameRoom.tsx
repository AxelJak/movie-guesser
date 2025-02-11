import { useState, useEffect } from 'react';
import { useZero, useQuery } from "@rocicorp/zero/react";
import { useCookies } from 'react-cookie';
import { useLocation } from "wouter";
import { Schema } from "@/schema";
import type { Movie } from "@/schema";
import { createGuess } from "@/utils/guess";
import { createMessage } from "@/utils/message";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PlayersList from "@/components/PlayersList";
import Settings from "@/components/room/Settings";
import MovieAutocomplete from '@/components/movie/MovieAutocomplete';
import MovieCard from '@/components/room/MovieCard';

export default function GameRoom({ roomKey, setPlayerJoined }: { roomKey: string, setPlayerJoined: any }) {
  const [_, navigate] = useLocation(); 

  const z = useZero<Schema>();
  const [cookies] = useCookies(["playerId"]);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState({});
  const [playerId, setPlayerId] = useState<string>('');
  const [currentMovie, setCurrentMovie] = useState<Movie | undefined>();
  
  const rooms = z.query.room
  .related('players')
  .related('gameState', (gameState) => gameState.one())
  .related('settings', (settings) => settings.one())
  .where("room_key", roomKey);
  
  const [room, roomResult] = useQuery(rooms.one());
  
  useEffect(() => {
    if (room && room.settings) {
      setSettings(room.settings);
    }
  }, [room, settings]);

  useEffect(() => {
    const movies = z.query.movie.where('id', '10681').one().run();
    console.log(movies);
    setCurrentMovie(movies);
  }, []);
  
  
  const messageQuery = z.query.message
      .related("sender", (sender) => sender.one())
      .where("roomID", room?.id ?? '')
      .orderBy("timestamp", 'desc');
  const guessQuery = z.query.guess
      .related("sender", (sender) => sender.one())
      .where("roomID", room?.id ?? '')
      .orderBy("timestamp", 'asc');
  const [guessesByRoom] = useQuery(guessQuery);
  const [messages] = useQuery(messageQuery);
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
  
  function submitGuess(movieTitle: string) {
    if (!room) return;
    z.mutate.guess.insert(createGuess(movieTitle, room.id, cookies.playerId));
  }

  function submitMessage() {
    if (!room || !message) return;
    z.mutate.message.insert(createMessage(message, room.id, cookies.playerId));
    setMessage(""); // Clear input after submission
  }

  function leaveRoom() {
    if (playerId) {
      z.mutate.player.update({
        id: playerId,
        roomID: null,
      });
      if (room?.players.length === 1 && room.players[0].id === playerId) {
        //Dosen't work for some reason
        z.mutate.room.delete({id: room.id});
      }
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
    <div className="flex bg-white p-5 rounded-lg border-2">
      <button className="absolute left-20 top-20" onClick={() => leaveRoom()}>
        Back
      </button>
      <div className="flex gap-2">

        { currentMovie && <div className="w-[350px] absolute">
          <MovieCard movie={currentMovie} />
        </div>}
        <div className="flex flex-col gap-2">
          <PlayersList roomPlayers={room.players} />
          {currentPlayer?.isHost && <Button>Start game</Button>}
        </div>
        <div className="flex flex-col gap-2 justify-between" >
          <span className="text-3xl font-bold text-center">Room {room.room_key}</span>
          <div className="flex flex-col justify-end grow">
            <div className="h-[700px] overflow-y-auto flex flex-col-reverse">
              {messages.map((message) =>
                <span key={message.id} className="text-l">
                  {`${message.sender?.name}: ${message.message}`}
                </span>
              )}
              {guessesByRoom.map(guess => <span key={guess.id} className="text-l text-blue-400">{guess.sender?.name}: {guess.guess}</span>)}
            </div>
          </div>
          <div className="flex gap-2">
            { room.settings && <MovieAutocomplete listId={room.settings.listID} onSelect={(movieTitle) => submitGuess(movieTitle)} /> }
            <Input 
              className="w-[400px]"
              type="text" 
              value={message}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  submitMessage();
                }
              }}
              onChange={(e: any) => setMessage(e.target.value)} 
              />
            <Button onClick={submitMessage}>Send</Button>
          </div>
        </div>
        {currentPlayer?.isHost && Object.keys(settings).length > 0 && (
            <Settings roomSettings={settings} />
        )}
      </div>
    </div>
  );
}