import { TrendingUp } from 'lucide-react';
import type { ElementType } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  total?: number;
  icon: ElementType;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
    icon: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    bar: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    border: 'border-blue-100 dark:border-blue-900/30'
  },
  green: {
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    border: 'border-emerald-100 dark:border-emerald-900/30'
  },
  purple: {
    bg: 'bg-violet-50/50 dark:bg-violet-950/20',
    icon: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    bar: 'bg-gradient-to-r from-violet-500 to-fuchsia-400',
    border: 'border-violet-100 dark:border-violet-900/30'
  },
  amber: {
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    icon: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-400',
    border: 'border-amber-100 dark:border-amber-900/30'
  },
};

export default function StatCard({ label, value, total, icon: Icon, color }: StatCardProps) {
  const c = COLOR_MAP[color];
  const pct = total && total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className={`relative bg-card rounded-2xl border ${c.border} p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 overflow-hidden group`}>
      {/* Decorative gradient blur */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${c.bar} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-none">{value}</p>
            {total !== undefined && (
              <p className="text-xs font-medium text-muted-foreground">/ {total}</p>
            )}
          </div>
        </div>
        <div className={`${c.iconBg} p-2 rounded-xl shadow-sm`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>

      {total !== undefined && (
        <div className="relative z-10 mt-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Progreso: {pct}%</span>
            </div>
          </div>
          <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden">
            <div
              className={`h-full ${c.bar} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
