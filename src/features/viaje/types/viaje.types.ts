import { TipoTransporte } from '../../formulario/types/participante.types';
export type { TipoTransporte };

// ── Datos de viaje que se actualizan vía PATCH ──

export interface ViajeFormData {
  tipoTransporte: TipoTransporte | '';
  empresaTransporte: string;
  nroVuelo: string;
  fechaLlegada: string;
  fechaIda: string;
  lugarLlegada: string;
  boletoUrl: string | null;
  boletoNombre: string; // solo visual, no va al backend
}

export const initialViajeData: ViajeFormData = {
  tipoTransporte: '',
  empresaTransporte: '',
  nroVuelo: '',
  fechaLlegada: '',
  fechaIda: '',
  lugarLlegada: '',
  boletoUrl: null,
  boletoNombre: '',
};

export type ViajeValidationErrors = Record<string, string>;
