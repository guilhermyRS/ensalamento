'use client';
import { useState, useEffect } from 'react';
import RoomCard from './components/RoomCard';

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para obter o dia da semana atual em português
  const getCurrentDay = () => {
    const days = {
      0: 'Domingo',
      1: 'Segunda',
      2: 'Terça',
      3: 'Quarta',
      4: 'Quinta',
      5: 'Sexta',
      6: 'Sábado'
    };
    return days[new Date().getDay()];
  };

  // Função para determinar o turno atual baseado na hora
  const getCurrentShift = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'matutino';
    if (hour >= 12 && hour < 18) return 'vespertino';
    return 'noturno';
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (!response.ok) throw new Error('Erro ao carregar salas');
      const data = await response.json();
      
      // Filtra as salas com base no dia e turno atual
      const currentDay = getCurrentDay();
      const currentShift = getCurrentShift();
      
      const filteredRooms = data.filter(room => 
        room.days.includes(currentDay) && 
        room.shift === currentShift
      );
      
      setRooms(filteredRooms);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // Atualiza os dados a cada 5 segundos
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  // Componente para mostrar o dia e turno atual
  const CurrentInfo = () => (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      <p className="text-blue-800">
        <span className="font-semibold">Dia atual:</span> {getCurrentDay()}
      </p>
      <p className="text-blue-800">
        <span className="font-semibold">Turno atual:</span> {getCurrentShift()}
      </p>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista de Salas</h1>
      
      <CurrentInfo />

      {rooms.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Não há salas disponíveis para {getCurrentDay()} no turno {getCurrentShift()}.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}