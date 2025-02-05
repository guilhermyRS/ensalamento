// components/Sidebar.js
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaHome, FaCog, FaChevronDown } from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="hidden lg:flex flex-col w-64 bg-gray-800 h-screen fixed left-0 top-0">
      <div className="p-5">
        <h1 className="text-white text-2xl font-bold">Sistema de Salas</h1>
      </div>
      <nav className="flex-1">
        <Link 
          href="/"
          className={`flex items-center py-3 px-5 text-gray-300 hover:bg-gray-700 ${
            pathname === '/' ? 'bg-gray-700' : ''
          }`}
        >
          <FaHome className="mr-3" />
          <span>Início</span>
        </Link>
        
        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between py-3 px-5 text-gray-300 hover:bg-gray-700 ${
              ['/gerenciar', '/reservas'].includes(pathname) ? 'bg-gray-700' : ''
            }`}
          >
            <div className="flex items-center">
              <FaCog className="mr-3" />
              <span>Gerenciar Salas</span>
            </div>
            <FaChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`${isDropdownOpen ? 'block' : 'hidden'} bg-gray-900`}>
            <Link 
              href="/gerenciar"
              className={`flex items-center py-3 px-8 text-gray-300 hover:bg-gray-700 ${
                pathname === '/gerenciar' ? 'bg-gray-700' : ''
              }`}
            >
              <span>Salas</span>
            </Link>
            <Link 
              href="/reservas"
              className={`flex items-center py-3 px-8 text-gray-300 hover:bg-gray-700 ${
                pathname === '/reservas' ? 'bg-gray-700' : ''
              }`}
            >
              <span>Reservas</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}