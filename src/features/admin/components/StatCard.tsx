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
    iconColor: '#009DE1',
    iconBg: 'rgba(0, 157, 225, 0.08)',
    dot: '#009DE1',
  },
  green: {
    iconColor: '#10B981',
    iconBg: 'rgba(16, 185, 129, 0.08)',
    dot: '#10B981',
  },
  purple: {
    iconColor: '#8B5CF6',
    iconBg: 'rgba(139, 92, 246, 0.08)',
    dot: '#8B5CF6',
  },
  amber: {
    iconColor: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.08)',
    dot: '#F59E0B',
  },
};

export default function StatCard({ label, value, total, icon: Icon, color }: StatCardProps) {
  const c = COLOR_MAP[color];
  const pct = total && total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div
      className="bg-card rounded-xl border border-border px-4 py-3.5 shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-between gap-4 animate-fade-up"
    >
      <div className="flex items-center gap-3">
        {/* Compact Icon */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: c.iconBg }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: c.iconColor }} />
        </div>
        
        {/* Label and Value */}
        <div className="flex flex-col">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <p
              className="text-lg font-bold tracking-tight leading-none"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}
            >
              {value.toLocaleString()}
            </p>
            {total !== undefined && (
              <span className="text-[10px] text-muted-foreground font-medium">
                / {total} ({pct}%)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
