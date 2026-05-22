import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Hotel,
  FileBarChart2,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/logistica', label: 'Logística', icon: Hotel },
  { to: '/admin/reportes', label: 'Reportes', icon: FileBarChart2 },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">G</span>
        </div>
        <div>
          <p className="text-sm font-bold text-foreground leading-none">Genesis</p>
          <p className="text-xs text-muted-foreground">Panel Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                <span>{label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto w-3.5 h-3.5 text-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Administrador</p>
            <p className="text-xs text-muted-foreground truncate">Genesis Events</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
