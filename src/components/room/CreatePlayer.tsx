import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createPlayer } from "@/utils/player";
import { useCookies } from "react-cookie";
import { nanoid } from "nanoid";

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
  const [player, playerResult] = useQuery(playerQuery.where("id", cookies.playerId ?? '').one());

  if (!player && playerResult.type === 'complete') {
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
    const playerId = player?.id ?? nanoid();
    const createdPlayer = createPlayer(playerId, nickname, room.id, makeHost);
    z.mutate.player.upsert(createdPlayer);
    setCookie("playerId", createdPlayer.id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 5) });
    setPlayerJoined(true);
  }

  return (
    <div className="flex flex-col bg-white p-5 rounded-lg border-2 gap-7">
      <h1 className="text-5xl font-bold text-center">Create player</h1>
      <div>
        <Label htmlFor="nickname">Nickname</Label>
        <Input id="nickname" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      </div>
      <Button onClick={() => insertPlayer()} >{ createRoom ? 'Create room' : 'Join room' }</Button>
    </div>
  )
}