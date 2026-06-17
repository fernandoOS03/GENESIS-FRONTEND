import { useState } from 'react';
import { Users } from 'lucide-react';
import { useParticipantes } from '../hooks/useParticipantes';
import ParticipantsTable from '../components/ParticipantsTable';
import ParticipantDetailModal from '../components/ParticipantDetailModal';
import AddParticipantModal from '../components/AddParticipantModal';
import type { ParticipanteAdmin } from '../types/admin.types';

export default function ParticipantesPage() {
  const { participantes, loading, error, refetch } = useParticipantes();
  const [selected, setSelected] = useState<ParticipanteAdmin | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8 animate-fade-up max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Directorio de Participantes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona la lista completa de inscritos y sus respectivos estados.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-medium">
          Error: {error}
        </div>
      )}

      <div className="bg-card rounded-[24px] shadow-modern border border-border/40 overflow-hidden mb-10">
        <ParticipantsTable
          participantes={participantes}
          loading={loading}
          onAddNew={() => setShowModal(true)}
          onViewDetail={setSelected}
          onRefresh={refetch}
        />
      </div>

      <ParticipantDetailModal
        participante={selected}
        onClose={() => setSelected(null)}
        onRefresh={refetch}
      />
      <AddParticipantModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          refetch(); // Recargar tras agregar
        }}
      />
    </div>
  );
}
