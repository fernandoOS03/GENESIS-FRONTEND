import axiosInstance from '@/api/axiosInstance';
import type { ParticipanteAdmin } from '../types/admin.types';

export const adminService = {
  /**
   * GET /api/v1/participantes
   * Devuelve todos los participantes registrados
   */
  getParticipantes: async (): Promise<ParticipanteAdmin[]> => {
    const res = await axiosInstance.get<ParticipanteAdmin[]>('/api/v1/participantes');
    return res.data;
  },
};
