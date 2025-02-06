import { Schema } from "./schema";
import { useZero, useQuery } from "@rocicorp/zero/react"
import { randWord } from "./utils/rand"; 
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createSetting } from "@/utils/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Start() {

  const z = useZero<Schema>();
  const [_, navigate] = useLocation();

  const rooms = z.query.room;
  const [room] = useQuery(rooms.related('players'));
  const [roomKey, setRoomKey] = useState("");
  const [roomKeys, setRoomKeys] = useState<string[]>([]);

  useEffect(() => {
    if (room && room.length > roomKeys.length) {
      setRoomKeys(room.map((room) => room.room_key));
    }
  }, [room]);

  function createRoom() {
    z.mutateBatch(async tx => {
      const roomID = nanoid();
      tx.room.insert({
        id: roomID,
        room_key: randWord(),
      });
      tx.settings.insert(createSetting(nanoid(), roomID));  
    });
  }

  function joinRoom() {
    if (roomKey.length < 4) return;
    navigate(`/room/${roomKey}`);
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h1 className="text-5xl font-bold">Movie guesser</h1>
        <Input type="text" placeholder="Room key" value={roomKey} onChange={(e: any) => setRoomKey(e.target.value)} />
        <Button onClick={() => joinRoom()}>Join room</Button>
        <Button onClick={() => createRoom()}>Create room</Button>
        <Button onClick={() => navigate("/admin")}>Admin</Button>
      </div>
      <div className="flex flex-col gap-1 border border-gray-300 rounded-md p-2 m-2">
        {room.length > 0 ? room.map((room) =>
          <div key={room.id} className="flex justify-between mx-3">
            <span className="text-l">
              {room.room_key}
            </span>
            <span>{room.players.length}</span>
          </div>
        ) : ''}
      </div>
    </div>
  );
}
