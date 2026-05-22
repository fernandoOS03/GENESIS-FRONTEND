import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import type { ParticipanteAdmin } from '../types/admin.types';

interface ParticipantActionMenuProps {
  participante: ParticipanteAdmin;
  onViewDetail: (p: ParticipanteAdmin) => void;
}

export default function ParticipantActionMenu({
  participante,
  onViewDetail,
}: ParticipantActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-xl border border-border shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
          <button
            onClick={() => { onViewDetail(participante); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent transition"
          >
            <Eye className="w-4 h-4 text-primary" />
            Ver detalle completo
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent transition"
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
            Editar datos
          </button>
          <div className="my-1 border-t border-border" />
          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
