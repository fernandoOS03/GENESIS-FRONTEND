import type { ParticipanteFormData } from '../../formulario/types/participante.types';

// ── Tipos que vienen del backend (GET /api/v1/participantes) ──

export interface ParticipanteAdmin {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  pais: string;
  telefono: string | null;
  tipoDocumento: string;
  nroDocumento: string;
  genero: string | null;
  sede: string | null;
  tallaPolo: string | null;
  condParticipacion: string | null;
  rol: string | null;
  estadoRegistro: string;
  codigoReserva: string | null;
  fechaRegistro: string;
  // Travel
  tipoTransporte: string | null;
  empresaTransporte: string | null;
  nroVuelo: string | null;
  lugarLlegada: string | null;
}

export type EstadoRegistro = 'PRE INSCRITO' | 'CONFIRMADO' | 'PENDIENTE' | string;

export interface EventStats {
  total: number;
  confirmados: number;
  preInscritos: number;
  conTransporte: number;
}

// Re-exportamos para usar en formularios del admin
export type { ParticipanteFormData };
