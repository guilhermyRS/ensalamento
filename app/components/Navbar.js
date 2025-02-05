// components/Navbar.js
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaHome, FaCog, FaChevronDown } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between py-3 px-4 text-gray-300 hover:bg-gray-700"
            >
              <div className="flex items-center">
                <FaCog className="mr-3" />
                <span>Gerenciar Salas</span>
              </div>
              <FaChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="bg-gray-900">
                <Link
                  href="/gerenciar"
                  className="flex items-center py-3 px-8 text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsOpen(false);
                  }}
                >
                  <span>Salas</span>
                </Link>
                <Link
                  href="/reservas"
                  className="flex items-center py-3 px-8 text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsOpen(false);
                  }}
                >
                  <span>Reservas</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}