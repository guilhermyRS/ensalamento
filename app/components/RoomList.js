'use client'
import RoomCard from './RoomCard';
import { useState } from 'react';

export default function RoomList({ initialRooms }) {
  const [rooms, setRooms] = useState(initialRooms);

  const handleStatusChange = (roomId, newStatus) => {
    setRooms(currentRooms =>
      currentRooms.map(room =>
        room.id === roomId ? { ...room, status: newStatus } : room
      )
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map(room => (
        <RoomCard 
          key={room.id} 
          room={room} 
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}