import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';
import type { ParticipanteAdmin, EventStats } from '../types/admin.types';

export function useParticipantes() {
  const [participantes, setParticipantes] = useState<ParticipanteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipantes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getParticipantes();
      setParticipantes(data);
    } catch {
      setError('Error al cargar los participantes. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipantes();
  }, []);

  const stats: EventStats = {
    total: participantes.length,
    confirmados: participantes.filter(p => p.estadoRegistro === 'CONFIRMADO').length,
    preInscritos: participantes.filter(p => p.estadoRegistro === 'PRE INSCRITO').length,
    conTransporte: participantes.filter(p => p.tipoTransporte != null).length,
  };

  return { participantes, loading, error, stats, refetch: fetchParticipantes };
}
