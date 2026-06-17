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
  // Payments
  cuentaId?: string;
  totalAbonado?: number;
  tarifaCongelada?: number;
  cuentaMoneda?: string;
}

export type EstadoRegistro = 'PRE_INSCRITO' | 'FALT_TRANSPORTE' | 'PENDIENTE_PAGO' | 'PAGO_PARCIAL' | 'PAGO_COMPLETADO' | 'COMPLETADO' | string;

export interface EventStats {
  total: number;
  preInscrito: number;
  faltTransporte: number;
  pendientePago: number;
  pagoParcial: number;
  pagoCompletado: number;
  completado: number;
  conTransporte: number;
}

// Re-exportamos para usar en formularios del admin
export type { ParticipanteFormData };
