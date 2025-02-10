import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPlayer } from "@/utils/player";
import { useCookies } from "react-cookie";

export default function CreatePlayer({ roomKey, createRoom, setPlayerJoined }: { roomKey: string, createRoom: boolean, setPlayerJoined: any }) {
  const z = useZero();
  const [nickname, setNickname] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(["playerId"]);
  const playerQuery = z.query.player;
  const roomQuery = z.query.room
        .where("room_key", roomKey)
        .related('players')
        .one();
  const [room] = useQuery(roomQuery);
  const [player] = useQuery(playerQuery.where("id", cookies.playerId ?? '').one());

  if (!player) {
    removeCookie('playerId');
  }

  useEffect(() => {
    if (player) {
      setNickname(player.name);
    }
  }, [player, room]);

  function insertPlayer() {
    if (!room) return;
    const makeHost = room.players.find((player) => player.isHost) === undefined ? true : false;
    const createdPlayer = createPlayer(nickname, room.id, makeHost);
    z.mutate.player.upsert(createdPlayer);
    setCookie("playerId", createdPlayer.id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 5) });
    setPlayerJoined(true);
  }

  return (
    <div>
      <h1>Create player</h1>
      <Input placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <Button onClick={() => insertPlayer()} >{ createRoom ? 'Create room' : 'Join room' }</Button>
    </div>
  )
}