import { useState } from 'react';
import { PiUsersLight, PiCheckCircleLight, PiUserFocusLight } from 'react-icons/pi';
import { useParticipantes } from '../hooks/useParticipantes';
import StatCard from '../components/StatCard';
import ParticipantsTable from '../components/ParticipantsTable';
import ParticipantDetailModal from '../components/ParticipantDetailModal';
import AddParticipantModal from '../components/AddParticipantModal';
import type { ParticipanteAdmin } from '../types/admin.types';

export default function DashboardPage() {
  const { participantes, loading, error, stats, refetch } = useParticipantes();
  const [selected, setSelected] = useState<ParticipanteAdmin | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Evento</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gestiona los participantes, registros y estadísticas del evento.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Total registrados"
          value={stats.total}
          icon={PiUsersLight}
          color="blue"
        />
        <StatCard
          label="Confirmados"
          value={stats.confirmados}
          total={stats.total}
          icon={PiCheckCircleLight}
          color="green"
        />
        <StatCard
          label="Pre inscritos"
          value={stats.preInscritos}
          total={stats.total}
          icon={PiUserFocusLight}
          color="purple"
        />
      </div>

      {/* Table */}
      <ParticipantsTable
        participantes={participantes}
        loading={loading}
        onAddNew={() => setShowModal(true)}
        onViewDetail={setSelected}
        onRefresh={refetch}
      />

      {/* Modal Detalles */}
      <ParticipantDetailModal
        participante={selected}
        onClose={() => setSelected(null)}
      />

      {/* Modal */}
      <AddParticipantModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
