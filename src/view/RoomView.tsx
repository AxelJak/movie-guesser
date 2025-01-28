import { Link, useParams } from 'wouter';
import { useZero, useQuery } from '@rocicorp/zero/react';
import { Schema } from '@/schema';

export default function RoomView() {
  const z = useZero<Schema>();
  const param = useParams();
  const roomKey = param[0] ?? '';

  const roomQuery = z.query.room.where("room_key", roomKey);
  
  return (
      <div className="bg-gray-100 min-h-screen">
        

      </div>
  )
}