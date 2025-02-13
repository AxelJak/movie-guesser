import { useQuery } from "@rocicorp/zero/react"
import { useZero } from "@/hooks/use-zero";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Input from "./components/Input";
import { randWord } from "./utils/rand";
import { createGame } from "@/hooks/useGame";
import { nanoid } from "nanoid";
import { createSetting } from "./utils/settings";

export default function Start() {

  const z = useZero();
  const [_, navigate] = useLocation();

  const rooms = z.query.room;
  const [room, roomResult] = useQuery(rooms);
  const [roomKeys, setRoomKeys] = useState<string[]>([]);
  const [roomKey, setRoomKey] = useState<string>('');

  useEffect(() => {
    console.log(roomResult);
    if (room && roomResult.type === 'complete') {
      setRoomKeys(room.map((room) => room.room_key));
    }
  }, [room]);

  function createRoom() {
    const roomKey = randWord();
    z.mutateBatch( async tx => {
      const roomId = nanoid();
      tx.room.insert({
        id: roomId,
        room_key: roomKey,
        created_at: new Date().getTime(),
      });
      tx.settings.insert(createSetting(nanoid(), roomId));
      tx.game_state.insert(createGame(nanoid(), roomId));
    });
    navigate(`/room/${roomKey}?action=create`);
  }

  function joinRoom() {
    if(roomKey.length < 4) return;
    navigate(`/room/${roomKey}`);
  }

  return (
    <div className="flex flex-col bg-white rounded-lg border-2 p-10 justify-center items-center">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h1 className="text-5xl font-bold">Movie guesser</h1>
        <Input placeholder="Room key" onChange={(e: any) => setRoomKey(e.target.value)} />
        <Button onClick={() => joinRoom()}>Join room</Button>
        <Button onClick={() => createRoom()}>Create room</Button>
        <Button onClick={() => navigate("/admin")}>Admin</Button>
      </div>
      {roomKeys.map((roomKey) => <div key={roomKey}>{roomKey}</div>)}
      {roomKeys.length}
    </div>
  );
}
