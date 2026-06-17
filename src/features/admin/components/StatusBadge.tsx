interface StatusBadgeProps {
  estado: string;
}

const ESTADO_CONFIG: Record<string, { label: string; dotColor: string; bg: string; text: string; border: string }> = {
  'PRE_INSCRITO': {
    label: 'Pre Inscrito',
    dotColor: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.08)',
    text: '#1E3A8A',
    border: 'rgba(59, 130, 246, 0.20)',
  },
  'COMPLETADO': {
    label: 'Completado',
    dotColor: '#10B981',
    bg: 'rgba(16, 185, 129, 0.08)',
    text: '#065F46',
    border: 'rgba(16, 185, 129, 0.20)',
  },
  'FALT_TRANSPORTE': {
    label: 'Falt. Transporte',
    dotColor: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.08)',
    text: '#92400E',
    border: 'rgba(245, 158, 11, 0.20)',
  },
  'PENDIENTE_PAGO': {
    label: 'Pendiente Pago',
    dotColor: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    text: '#7F1D1D',
    border: 'rgba(239, 68, 68, 0.20)',
  },
  'PAGO_PARCIAL': {
    label: 'Pago Parcial',
    dotColor: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.08)',
    text: '#4C1D95',
    border: 'rgba(139, 92, 246, 0.20)',
  },
  'PAGO_COMPLETADO': {
    label: 'Pago Completo',
    dotColor: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.08)',
    text: '#164E63',
    border: 'rgba(6, 182, 212, 0.20)',
  },
};

export default function StatusBadge({ estado }: StatusBadgeProps) {
  const config = ESTADO_CONFIG[estado] ?? {
    label: estado,
    dotColor: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.08)',
    text: '#475569',
    border: 'rgba(148, 163, 184, 0.20)',
  };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize"
      style={{
        background: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  );
}
