import { useState, useEffect } from 'react';
import { useZero, useQuery } from "@rocicorp/zero/react";
import { useCookies } from 'react-cookie';
import { useLocation } from "wouter";
import { Schema } from "@/schema";
import type { Movie } from "@/schema";
import { Button } from "@/components/ui/button";
import PlayersList from "@/components/PlayersList";
import Settings from "@/components/room/Settings";
import MovieCard from '@/components/room/MovieCard';
import RoomInput from "@/components/room/RoomInput";

export default function GameRoom({ roomKey, setPlayerJoined }: { roomKey: string, setPlayerJoined: any }) {
  const [_, navigate] = useLocation(); 

  const z = useZero<Schema>();
  const [cookies] = useCookies(["playerId"]);
  const [settings, setSettings] = useState({});
  const [showMovies, setShowMovies] = useState(true);
  const [playerId, setPlayerId] = useState<string>('');
  const [currentMovie, setCurrentMovie] = useState<Movie[] | undefined>();
  
  const rooms = z.query.room
  .related('players')
  .related('gameState', (gameState) => gameState.one())
  .related('settings', (settings) => settings.one())
  .where("room_key", roomKey);
  
  const [room, roomResult] = useQuery(rooms.one());
  const moviesQuery = z.query.list.related('movies').where('id', room?.settings?.listID ?? '');
  const [list, listResult] = useQuery(moviesQuery);

  useEffect(() => {
    if (room && room.settings) {
      setSettings(room.settings);
    }
  }, [room, settings]);

  useEffect(() => {
    if (listResult.type !== 'complete') return;
    const randomMovies = [];
    for (let i = 0; i < 3; i++) {
      const random = Math.floor(Math.random() * 100);
      randomMovies.push(list[0].movies[random]);
    }
    setCurrentMovie(randomMovies);
  }, [list]);
  
  
  const messageQuery = z.query.message
      .related("sender", (sender) => sender.one())
      .where("roomID", room?.id ?? '')
      .orderBy("timestamp", 'asc');
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

  function hideMovies() {
    setShowMovies(false);
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
    <div className="flex flex-col w-[70%] h-[60%] bg-white p-5 rounded-lg border-2">
      <Button className="absolute left-20 top-20" onClick={() => leaveRoom()}>
        Back
      </Button>
      <Button className="absolute left-0 top-0" onClick={() => hideMovies()}>
        {showMovies ? 'Hide' : 'Show'}
      </Button>

      <span className="text-3xl font-bold text-center">Room {room.room_key}</span>
      { currentMovie && showMovies && <MovieCard movies={currentMovie} />}
      <div className='flex grow gap-2'>
        <div className="flex flex-col gap-2">
          <PlayersList roomPlayers={room.players} />
          {currentPlayer?.isHost && <Button>Start game</Button>}
        </div>
        <div className="flex flex-col grow gap-2 justify-between" >
          <div className="flex flex-col justify-end grow">
              {[...messages, ...guessesByRoom]
                .sort((a, b) => a.timestamp - b.timestamp)
                .map(item => {
                  const isGuess = 'guess' in item;
                  return (
                    <span 
                      key={item.id} 
                      className={`text-l ${isGuess ? 'text-blue-400' : ''}`}
                    >
                      {`${item.sender?.name}: ${isGuess ? item.guess : item.message}`}
                    </span>
                  );
                })}
          </div>
          {room.settings ? <RoomInput listId={room.settings.listID} roomId={room.id} playerId={playerId} /> : <div>loading</div> }
        </div>
        {currentPlayer?.isHost && Object.keys(settings).length > 0 && (
            <Settings roomSettings={settings} />
        )}
      </div>
    </div>
  );
}