'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCog } from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();

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
        <Link 
          href="/gerenciar"
          className={`flex items-center py-3 px-5 text-gray-300 hover:bg-gray-700 ${
            pathname === '/gerenciar' ? 'bg-gray-700' : ''
          }`}
        >
          <FaCog className="mr-3" />
          <span>Gerenciar Salas</span>
        </Link>
      </nav>
    </div>
  );
}