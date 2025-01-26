import { Schema } from "./schema";
import { useZero, useQuery } from "@rocicorp/zero/react"
import {randID, randWord } from "./utils/rand";
import { useState } from "react";
import { useLocation } from "wouter";
import Input from "./components/Input";

export default function Start() {

  const z = useZero<Schema>();
  const [_, navigate] = useLocation();

  const rooms = z.query.room;
  const [room] = useQuery(rooms);
  const [roomKey, setRoomKey] = useState("");

  function createRoom() {
    const roomKey = randWord();
    z.mutate.room.insert({
      id: randID(),
      room_key: roomKey,
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
        <button onClick={() => joinRoom()}>Join room</button>
        <button onClick={() => createRoom()}>Create room</button>
        <button onClick={() => navigate("/admin")}>Admin</button>
      </div>
      <div className="flex flex-col gap-1 border border-gray-300 rounded-md p-2 m-2">
        {room.length > 0 ? room.map((room) =>
          <span key={room.id} className="text-l">
            {room.room_key}
          </span>
        ) : ''}
      </div>
    </div>
  );
}
