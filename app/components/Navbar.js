'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaHome, FaCog } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Sistema de Salas</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="bg-gray-800 w-full">
          <Link
            href="/"
            className="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <FaHome className="mr-3" />
            <span>Início</span>
          </Link>
          <Link
            href="/gerenciar"
            className="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <FaCog className="mr-3" />
            <span>Gerenciar Salas</span>
          </Link>
        </div>
      )}
    </div>
  );
}