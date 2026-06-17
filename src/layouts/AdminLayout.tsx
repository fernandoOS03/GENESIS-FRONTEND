import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../features/admin/components/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) {
    return null; // Evita el parpadeo de contenido mientras redirige
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 min-w-0">
        {/* Aquí podríamos agregar un AdminTopbar en el futuro si es necesario */}
        <main className="flex-1 overflow-y-auto p-8 thin-scrollbar w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
