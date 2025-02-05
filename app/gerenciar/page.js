'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import RoomForm from '../components/RoomForm';

export default function GerenciarSalas() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/rooms');
      if (!response.ok) throw new Error('Erro ao carregar salas');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      toast.error('Erro ao carregar salas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = selectedRoom 
        ? `/api/rooms/${selectedRoom.id}`
        : '/api/rooms';
      
      const response = await fetch(url, {
        method: selectedRoom ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao ${selectedRoom ? 'atualizar' : 'criar'} sala`);
      }
      
      toast.success(`Sala ${selectedRoom ? 'atualizada' : 'criada'} com sucesso!`);
      setShowModal(false);
      fetchRooms();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleDelete = async (room) => {
    if (!confirm('Tem certeza que deseja excluir esta sala?')) return;

    try {
      const response = await fetch(`/api/rooms/${room.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir sala');
      
      toast.success('Sala excluída com sucesso!');
      fetchRooms();
    } catch (error) {
      toast.error('Erro ao excluir sala');
    }
  };

  const handleStatusChange = async (room) => {
    try {
      const newStatus = room.status === 'open' ? 'closed' : 'open';
      const response = await fetch(`/api/rooms/${room.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      setRooms(currentRooms =>
        currentRooms.map(r =>
          r.id === room.id ? { ...r, status: newStatus } : r
        )
      );
      
      toast.success(`Sala ${newStatus === 'open' ? 'aberta' : 'fechada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da sala');
      console.error('Error:', error);
    }
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Salas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Adicionar Sala
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{room.name}</h3>
                  <p className="text-sm text-gray-600">{room.days}</p>
                  <p className="text-sm text-gray-600 capitalize">{room.shift}</p>
                </div>
                <div className="space-y-2">
                  {/* Switch estilizado */}
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={room.status === 'open'}
                        onChange={() => handleStatusChange(room)}
                      />
                      <div className={`
                        w-14 h-7 rounded-full 
                        transition-colors duration-300 ease-in-out
                        ${room.status === 'open' ? 'bg-green-500' : 'bg-red-500'}
                      `}>
                        <div className={`
                          absolute left-1 top-1
                          w-5 h-5 
                          bg-white rounded-full
                          transition-transform duration-300 ease-in-out
                          ${room.status === 'open' ? 'transform translate-x-7' : ''}
                        `}>
                        </div>
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {room.status === 'open' ? 'Aberta' : 'Fechada'}
                    </span>
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(room)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedRoom ? 'Editar' : 'Adicionar'} Sala
              </h2>
              <RoomForm
                room={selectedRoom}
                onSubmit={handleSubmit}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}