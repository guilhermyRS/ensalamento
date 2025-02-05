'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function StatusSwitch({ roomId, initialStatus, onStatusChange }) {
  const [status, setStatus] = useState(initialStatus || 'closed');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    try {
      setIsUpdating(true);
      const newStatus = status === 'open' ? 'closed' : 'open';
      
      console.log('Sending status update:', newStatus, 'for room:', roomId);
      
      const response = await fetch(`/api/rooms/${roomId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar status');
      }

      setStatus(newStatus);
      onStatusChange?.(newStatus);
      toast.success(`Sala ${newStatus === 'open' ? 'aberta' : 'fechada'} com sucesso!`);
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error(error.message || 'Erro ao alterar status da sala');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`
        px-3 py-1 rounded-full text-sm font-medium
        transition-colors duration-200
        ${status === 'open' 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-red-100 text-red-800 hover:bg-red-200'}
        ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isUpdating ? '...' : status === 'open' ? 'Aberto' : 'Fechado'}
    </button>
  );
}