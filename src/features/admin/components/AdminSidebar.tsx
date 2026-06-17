import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  UsersRound, 
  DollarSign, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { USER_ROLE_LABELS, type UserRole } from '../types/usuarios.types';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, roles: ['ROLE_SUPER_ADMIN', 'ROLE_COUNTRY_ADMIN', 'ROLE_EDITOR'] },
  { to: '/admin/logistica', label: 'Logística', icon: Package, roles: ['ROLE_SUPER_ADMIN', 'ROLE_COUNTRY_ADMIN', 'ROLE_EDITOR'] },
  { to: '/admin/reportes', label: 'Reportes', icon: FileText, roles: ['ROLE_SUPER_ADMIN', 'ROLE_COUNTRY_ADMIN', 'ROLE_EDITOR'] },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users, roles: ['ROLE_SUPER_ADMIN'] },
  { to: '/admin/participantes', label: 'Participantes', icon: UsersRound, roles: ['ROLE_SUPER_ADMIN', 'ROLE_COUNTRY_ADMIN', 'ROLE_EDITOR'] },
  { to: '/admin/pagos', label: 'Pagos', icon: DollarSign, roles: ['ROLE_SUPER_ADMIN'] },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const userRole = user?.rol as UserRole;

  const getInitials = (name?: string) => {
    if (!name) return 'A';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? 'Administrador';
  const rolLabel = user?.rol ? (USER_ROLE_LABELS[userRole] ?? user.rol) : 'Editor';

  const visibleNavItems = NAV_ITEMS.filter(item => 
    !item.roles || (userRole && item.roles.includes(userRole))
  );

  return (
    <>
      <aside 
        className={cn(
          "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 relative z-20",
          isCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-card border border-border w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm z-30"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Brand / Logo */}
        <div className={cn("flex items-center h-20 shrink-0", isCollapsed ? "justify-center px-0" : "px-6 gap-3")}>
          <img src="/logo-iyg.png" alt="Logo IYF" className="h-6 object-contain" />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto thin-scrollbar px-3 py-2 flex flex-col gap-1.5">
          {visibleNavItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) => cn(
                "flex items-center rounded-md transition-colors",
                "text-sm font-medium",
                isCollapsed ? "justify-center w-12 h-12 mx-auto" : "px-3 h-10 gap-3",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </div>

        {/* User Profile & Actions */}
        <div className="shrink-0 border-t border-border p-3 mt-auto">
          <div className={cn("flex items-center gap-3", isCollapsed && "flex-col")}>
            
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-soft shrink-0">
              {getInitials(user?.name)}
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{firstName}</p>
                <p className="text-[11px] font-medium text-muted-foreground truncate">{rolLabel}</p>
              </div>
            )}

            <button 
              onClick={() => setShowLogoutModal(true)}
              title="Cerrar Sesión"
              className={cn(
                "rounded-md flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0",
                isCollapsed ? "w-10 h-10 mt-2" : "w-8 h-8"
              )}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-card rounded-md shadow-md border border-border w-full max-w-sm p-6 animate-fade-up">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              ¿Cerrar sesión?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Estás a punto de salir de tu cuenta. Tendrás que volver a ingresar tus credenciales para acceder al panel.
            </p>
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 px-4 rounded-md border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-muted transition-colors shadow-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="flex-1 py-2 px-4 rounded-md bg-destructive text-white text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
