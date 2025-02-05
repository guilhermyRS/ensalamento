// components/RoomForm.js
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';
import RoomNameModal from './RoomNameModal';

export default function RoomForm({ room, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    room_name_id: '',
    days: '',
    shift: 'matutino',
    unidade: '',
    curso: '',
    periodo: '',
    disciplina: '',
    docente: ''
  });
  const [roomNames, setRoomNames] = useState([]);
  const [isRoomNameModalOpen, setIsRoomNameModalOpen] = useState(false);

  useEffect(() => {
    fetchRoomNames();
  }, []);

  useEffect(() => {
    if (room) {
      setFormData({
        room_name_id: room.room_name_id || '',
        days: room.days || '',
        shift: room.shift || 'matutino',
        unidade: room.unidade || '',
        curso: room.curso || '',
        periodo: room.periodo || '',
        disciplina: room.disciplina || '',
        docente: room.docente || ''
      });
    }
  }, [room]);

  const fetchRoomNames = async () => {
    try {
      const response = await fetch('/api/rooms/room-names');
      if (!response.ok) throw new Error('Erro ao carregar nomes das salas');
      const data = await response.json();
      setRoomNames(data);
    } catch (error) {
      toast.error('Erro ao carregar nomes das salas');
    }
  };

  const handleRoomNameSave = (newRoomName) => {
    setRoomNames(prevNames => [...prevNames, newRoomName]);
    setFormData(prev => ({ ...prev, room_name_id: newRoomName.id.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.room_name_id) {
      toast.error('Selecione uma sala');
      return;
    }
  
    if (!formData.days) {
      toast.error('Selecione um dia da semana');
      return;
    }
  
    try {
      const dataToSubmit = {
        ...formData,
        room_name_id: parseInt(formData.room_name_id),
        // Garantir que todos os campos sejam incluídos
        unidade: formData.unidade,
        curso: formData.curso,
        periodo: formData.periodo,
        disciplina: formData.disciplina,
        docente: formData.docente
      };
      
      await onSubmit(dataToSubmit);
    } catch (error) {
      toast.error('Erro ao salvar sala');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const shifts = [
    { value: 'matutino', label: 'Matutino' },
    { value: 'vespertino', label: 'Vespertino' },
    { value: 'noturno', label: 'Noturno' }
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Sala
          </label>
          <div className="flex gap-2">
            <select
              name="room_name_id"
              value={formData.room_name_id}
              onChange={handleInputChange}
              className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selecione uma sala</option>
              {roomNames.map((rn) => (
                <option key={rn.id} value={rn.id}>
                  {rn.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsRoomNameModalOpen(true)}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              title="Adicionar nova sala"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Novos campos adicionados */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Unidade
          </label>
          <input
            type="text"
            name="unidade"
            value={formData.unidade}
            onChange={handleInputChange}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Curso
          </label>
          <input
            type="text"
            name="curso"
            value={formData.curso}
            onChange={handleInputChange}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Período
          </label>
          <input
            type="text"
            name="periodo"
            value={formData.periodo}
            onChange={handleInputChange}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Disciplina
          </label>
          <input
            type="text"
            name="disciplina"
            value={formData.disciplina}
            onChange={handleInputChange}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Docente
          </label>
          <input
            type="text"
            name="docente"
            value={formData.docente}
            onChange={handleInputChange}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Dia da Semana
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {weekDays.map((day) => (
              <label key={day} className="flex items-center space-x-2 text-sm text-gray-700 p-2 rounded-md hover:bg-gray-50">
                <input
                  type="radio"
                  name="days"
                  value={day}
                  checked={formData.days === day}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Turno
          </label>
          <select
            name="shift"
            value={formData.shift}
            onChange={handleInputChange}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {shifts.map((shift) => (
              <option key={shift.value} value={shift.value}>
                {shift.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            {room ? 'Atualizar' : 'Criar'} Sala
          </button>
        </div>
      </form>

      <RoomNameModal
        isOpen={isRoomNameModalOpen}
        onClose={() => setIsRoomNameModalOpen(false)}
        onSave={handleRoomNameSave}
      />
    </>
  );
}