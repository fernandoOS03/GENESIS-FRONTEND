import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin.service';
import type { ParticipanteAdmin, EventStats } from '../types/admin.types';

export function useParticipantes() {
  const [participantes, setParticipantes] = useState<ParticipanteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipantes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getParticipantes();
      
      const mappedData = data.map(p => {
        const abonado = p.totalAbonado ?? 0;
        const tarifa = p.tarifaCongelada ?? 0;
        
        if (abonado > 0 && tarifa > 0) {
          if (abonado < tarifa) {
            return { ...p, estadoRegistro: 'PAGO_PARCIAL' };
          } else if (p.estadoRegistro !== 'COMPLETADO') {
            return { ...p, estadoRegistro: 'PAGO_COMPLETADO' };
          }
        }
        return p;
      });
      
      setParticipantes(mappedData);
    } catch (err: any) {
      const msg: string =
        err.friendlyMessage ||
        err.response?.data?.message ||
        'Error al cargar los participantes. Verifica la conexión con el servidor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParticipantes();
  }, []);

  const stats: EventStats = {
    total: participantes.length,
    preInscrito: participantes.filter(p => p.estadoRegistro === 'PRE_INSCRITO').length,
    faltTransporte: participantes.filter(p => p.estadoRegistro === 'FALT_TRANSPORTE').length,
    pendientePago: participantes.filter(p => p.estadoRegistro === 'PENDIENTE_PAGO').length,
    pagoParcial: participantes.filter(p => p.estadoRegistro === 'PAGO_PARCIAL').length,
    pagoCompletado: participantes.filter(p => p.estadoRegistro === 'PAGO_COMPLETADO').length,
    completado: participantes.filter(p => p.estadoRegistro === 'COMPLETADO').length,
    conTransporte: participantes.filter(p => p.tipoTransporte != null).length,
  };

  return { participantes, loading, error, stats, refetch: fetchParticipantes };
}
