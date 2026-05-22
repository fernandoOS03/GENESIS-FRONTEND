// ── Constantes de tipos (compatible con erasableSyntaxOnly) ──

export const TipoDocumento = {
  DNI: 'DNI',
  CI: 'CI',
  PASAPORTE: 'PASAPORTE',
  CARNET_EXTRANJERIA: 'CARNET_EXTRANJERIA',
} as const;
export type TipoDocumento = (typeof TipoDocumento)[keyof typeof TipoDocumento];

export const CondParticipacion = {
  MIEMBRO: 'MIEMBRO',
  INVITADO: 'INVITADO',
} as const;
export type CondParticipacion =
  (typeof CondParticipacion)[keyof typeof CondParticipacion];

export const TipoTransporte = {
  AEREO: 'AEREO',
  TERRESTRE: 'TERRESTRE',
  INDEPENDIENTE: 'INDEPENDIENTE',
} as const;
export type TipoTransporte =
  (typeof TipoTransporte)[keyof typeof TipoTransporte];

// ── Interfaces ──

export interface ParticipanteFormData {
  // Datos personales y contacto (Paso 1)
  tipoDocumento: TipoDocumento | '';
  nroDocumento: string;
  nombres: string;
  apellidos: string;
  email: string;
  pais: string;
  sede: string;
  telefono: string;
  genero: string;
  fechaNacimiento: string;
  tallaPolo: string;

  // Participación (Paso 2)
  condParticipacion: CondParticipacion | '';
  rol: string;

  // Transporte (Paso 3 — condicional)
  tipoTransporte: TipoTransporte | '';
  empresaTransporte: string;
  nroVuelo: string;
  fechaLlegada: string;
  fechaIda: string;
  lugarLlegada: string;
  boletoUrl: string | null;
  boletoNombre: string;
}

export const initialFormData: ParticipanteFormData = {
  tipoDocumento: '',
  nroDocumento: '',
  nombres: '',
  apellidos: '',
  email: '',
  pais: '',
  sede: '',
  telefono: '',
  genero: '',
  fechaNacimiento: '',
  tallaPolo: '',
  condParticipacion: '',
  rol: '',
  tipoTransporte: '',
  empresaTransporte: '',
  nroVuelo: '',
  fechaLlegada: '',
  fechaIda: '',
  lugarLlegada: '',
  boletoUrl: null,
  boletoNombre: '',
};

export type ValidationErrors = Record<string, string>;

export interface StepProps {
  formData: ParticipanteFormData;
  updateField: <K extends keyof ParticipanteFormData>(
    field: K,
    value: ParticipanteFormData[K]
  ) => void;
  validationErrors?: ValidationErrors;
}
