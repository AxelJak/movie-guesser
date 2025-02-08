import { useZero } from '@/hooks/use-zero';
import { useQuery } from '@rocicorp/zero/react';
import { Suspense, useState } from 'react';
import { useParams, useSearch } from 'wouter';
import GameRoom from '@/components/GameRoom';
import CreatePlayer from '@/components/room/CreatePlayer';

export default function Room() {
  const z = useZero();
  const params = useParams();
  const search = useSearch();
  const createRoom = search.split('=')[1] === 'create' ? true : false;
  const [playerJoined, setPlayerJoined] = useState(false);
  const roomKey = params[0] ?? '';

  const roomQuery = z.query.room.where('room_key', roomKey).one();
  const [room] = useQuery(roomQuery);
   

  return (
    <div className="border-2 rounded-lg w-[60%] bg-white p-10">
      <Suspense fallback={<div>Loading...</div>}>
        {!room && <div>No room found</div>}
        {room && !playerJoined && <CreatePlayer roomKey={room.room_key} createRoom={createRoom} setPlayerJoined={setPlayerJoined} />}
        {room && playerJoined && <GameRoom roomKey={room.room_key} />}
      </Suspense>
    </div>
  );
}
