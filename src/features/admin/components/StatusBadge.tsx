interface StatusBadgeProps {
  estado: string;
}

const ESTADO_CONFIG: Record<string, { label: string; className: string }> = {
  'PRE INSCRITO': {
    label: 'Pre Inscrito',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  CONFIRMADO: {
    label: 'Confirmado',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  PENDIENTE: {
    label: 'Pendiente',
    className: 'bg-orange-50 text-orange-700 border border-orange-200',
  },
};

export default function StatusBadge({ estado }: StatusBadgeProps) {
  const config = ESTADO_CONFIG[estado] ?? {
    label: estado,
    className: 'bg-gray-50 text-gray-700 border border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {config.label}
    </span>
  );
}
