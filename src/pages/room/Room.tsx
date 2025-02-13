import { useZero } from '@/hooks/use-zero';
import { useQuery } from '@rocicorp/zero/react';
import { useEffect, useState } from 'react';
import { useParams, useSearch, useLocation } from 'wouter';
import { useCookies } from 'react-cookie';
import GameRoom from '@/components/room/GameRoom';
import CreatePlayer from '@/components/room/CreatePlayer';

export default function Room() {
  const z = useZero();
  const params = useParams();
  const search = useSearch();
  const [_, navigate] = useLocation();
  const [cookies] = useCookies(["playerId"]);
  const playerId = cookies.playerId ?? '';
  const createRoom = search.split('=')[1] === 'create' ? true : false;
  const [playerJoined, setPlayerJoined] = useState(false);
  const roomKey = params[0] ?? '';

  const roomQuery = z.query.room.where('room_key', roomKey).related('players').one();
  const [room, roomResult] = useQuery(roomQuery);

  useEffect(() => {
    if (room && roomResult.type === 'complete' && room.players.find((player) => player.id === playerId)) {
      setPlayerJoined(true);
    }
  }, [room]);

  if(roomResult.type !== 'complete') {
    return (
      <div>
        <span>Loading...</span>
      </div>
    );
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

  if (!playerJoined) {
    return (
      <CreatePlayer roomKey={room.room_key} createRoom={createRoom} setPlayerJoined={setPlayerJoined} />
    )
  }
   
  return (
    <GameRoom roomKey={room.room_key} setPlayerJoined={setPlayerJoined} />
  )
}
