import './globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Sistema de Salas',
  description: 'Sistema de gerenciamento de salas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 lg:ml-64">
            <Navbar />
            <main className="p-4">
              {children}
            </main>
          </div>
        </div>
        <ToastContainer />
      </body>
    </html>
  )
}