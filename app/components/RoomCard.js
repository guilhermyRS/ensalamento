// components/RoomCard.js
'use client';
import { useState } from 'react';
import RoomDetailModal from './RoomDetailModal';

export default function RoomCard({ room }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shiftColors = {
    'matutino': 'bg-blue-100 border-blue-500',
    'vespertino': 'bg-yellow-100 border-yellow-500',
    'noturno': 'bg-purple-100 border-purple-500'
  };

  const statusColors = {
    'open': 'bg-green-100 text-green-800',
    'closed': 'bg-red-100 text-red-800'
  };

  return (
    <>
      <div
        className={`p-4 rounded-lg border-l-4 ${shiftColors[room.shift]} shadow-md cursor-pointer hover:shadow-lg transition-shadow`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">Sala: {room.name}</h3>
            <p className="text-gray-600">Dia: {room.days}</p>
            <p className="text-gray-600 capitalize">Turno: {room.shift}</p>
          </div>
          <span className={`
            px-2 py-1 
            rounded-full 
            text-sm 
            font-medium
            ${statusColors[room.status || 'closed']}
          `}>
            {room.status === 'open' ? 'Aberta' : 'Fechada'}
          </span>
        </div>
      </div>

      <RoomDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={room}
      />
    </>
  );
}