import { useState, useMemo, useCallback } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import {
  type ParticipanteFormData,
  type ValidationErrors,
  initialFormData,
  CondParticipacion,
  TipoTransporte,
} from '../types/participante.types';
import {
  SEDES_LIMA_OPCIONES,
} from '@/lib/constants';
import { participanteService } from '../services/participante.service';

// ── Validaciones por paso ──

function validateDatosContacto(d: ParticipanteFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!d.tipoDocumento) errors.tipoDocumento = 'Selecciona un tipo de documento.';
  if (!d.nroDocumento.trim()) errors.nroDocumento = 'Ingresa el número de documento.';
  if (!d.nombres.trim()) errors.nombres = 'Ingresa tus nombres.';
  if (!d.apellidos.trim()) errors.apellidos = 'Ingresa tus apellidos.';
  if (!d.email.trim()) errors.email = 'Ingresa tu correo electrónico.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    errors.email = 'El correo electrónico no es válido.';
  if (!d.pais) errors.pais = 'Selecciona un país.';
  // sede solo obligatoria para Perú
  if (d.pais === 'PE' && !d.sede) errors.sede = 'Selecciona una sede.';
  if(!d.telefono || !isValidPhoneNumber(d.telefono)){
    errors.telefono = 'Ingresa un número de teléfono válido.';
  }
  if (!d.genero) errors.genero = 'Selecciona tu género.';
  if (!d.fechaNacimiento) errors.fechaNacimiento = 'Selecciona tu fecha de nacimiento.';
  if (!d.tallaPolo) errors.tallaPolo = 'Selecciona tu talla de polo.';
  return errors;
}

function validateParticipacion(d: ParticipanteFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!d.condParticipacion) errors.condParticipacion = 'Selecciona tu condición de participación.';
  if (d.condParticipacion === CondParticipacion.MIEMBRO && !d.rol)
    errors.rol = 'Selecciona un rol para miembros.';
  return errors;
}

function validateTransporte(d: ParticipanteFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!d.tipoTransporte) {
    errors.tipoTransporte = 'Selecciona un tipo de transporte o salta este paso.';
    return errors;
  }

  const tipo = d.tipoTransporte;

  if (tipo === TipoTransporte.AEREO || tipo === TipoTransporte.TERRESTRE) {
    if (!d.empresaTransporte.trim()) errors.empresaTransporte = 'Ingresa la empresa de transporte.';
    if (!d.fechaLlegada) errors.fechaLlegada = 'Selecciona la fecha de llegada.';
    if (!d.fechaIda) errors.fechaIda = 'Selecciona la fecha de ida.';
  }

  if (tipo === TipoTransporte.AEREO) {
    if (!d.nroVuelo.trim()) errors.nroVuelo = 'Ingresa el número de vuelo.';
  }

  if (tipo === TipoTransporte.TERRESTRE) {
    if (!d.lugarLlegada.trim()) errors.lugarLlegada = 'Ingresa el lugar de llegada.';
  }

  if (tipo === TipoTransporte.INDEPENDIENTE) {
    if (!d.fechaLlegada) errors.fechaLlegada = 'Selecciona la fecha de llegada.';
    if (!d.fechaIda) errors.fechaIda = 'Selecciona la fecha de ida.';
  }

  return errors;
}

// ── Paso index → validador ──

type Validator = (d: ParticipanteFormData) => ValidationErrors;

const VALIDATORS_WITH_TRANSPORT: Validator[] = [
  validateDatosContacto,
  validateParticipacion,
  validateTransporte,
  () => ({}), // resumen
];

const VALIDATORS_NO_TRANSPORT: Validator[] = [
  validateDatosContacto,
  validateParticipacion,
  () => ({}), // resumen
];

// ── Labels ──

const LABELS_WITH_TRANSPORT = [
  'Datos y Contacto',
  'Participación',
  'Transporte',
  'Resumen',
];

const LABELS_NO_TRANSPORT = [
  'Datos y Contacto',
  'Participación',
  'Resumen',
];

// ── Hook ──

export function useWizardForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ParticipanteFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [transportSkipped, setTransportSkipped] = useState(false);

  // Determinar si el participante es de Lima (sin transporte)
  // Si la sede elegida está en SEDES_LIMA_OPCIONES → no necesita transporte
  const isFromLima = useMemo(() => {
    if (formData.pais !== 'PE') return false;
    return SEDES_LIMA_OPCIONES.some((s) => s.value === formData.sede);
  }, [formData.pais, formData.sede]);

  const showTransport = !isFromLima;
  const stepLabels = showTransport ? LABELS_WITH_TRANSPORT : LABELS_NO_TRANSPORT;
  const validators = showTransport ? VALIDATORS_WITH_TRANSPORT : VALIDATORS_NO_TRANSPORT;
  const totalSteps = stepLabels.length;

  const updateField = useCallback(
    <K extends keyof ParticipanteFormData>(field: K, value: ParticipanteFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Limpiar errores al editar
      setValidationErrors({});
    },
    []
  );

  const validateCurrentStep = useCallback((): boolean => {
    const errs = validators[currentStep](formData);
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  }, [currentStep, formData, validators]);

  const validateAll = useCallback((): boolean => {
    let allErrors: ValidationErrors = {};
    for (const valFn of validators) {
      const errs = valFn(formData);
      allErrors = { ...allErrors, ...errs };
    }
    setValidationErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [formData, validators]);

  const next = useCallback(() => {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      setValidationErrors({});
    }
  }, [currentStep, totalSteps, validateCurrentStep]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      setValidationErrors({});
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps && step <= currentStep) {
        setDirection(step > currentStep ? 1 : -1);
        setCurrentStep(step);
        setValidationErrors({});
      }
    },
    [currentStep, totalSteps]
  );

  const skipTransport = useCallback(() => {
    setTransportSkipped(true);
    setFormData((prev) => ({
      ...prev,
      tipoTransporte: '',
      empresaTransporte: '',
      nroVuelo: '',
      fechaLlegada: '',
      fechaIda: '',
      lugarLlegada: '',
      boletoUrl: null,
    }));
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
    setValidationErrors({});
  }, []);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await participanteService.create(formData);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al registrar participante.');
      } else {
        setError('Error al registrar participante.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setIsSuccess(false);
    setError(null);
    setValidationErrors({});
    setTransportSkipped(false);
  }, []);

  return {
    currentStep,
    totalSteps,
    stepLabels,
    formData,
    isSubmitting,
    isSuccess,
    error,
    direction,
    validationErrors,
    showTransport,
    transportSkipped,
    updateField,
    validateAll,
    next,
    prev,
    goToStep,
    skipTransport,
    submit,
    reset,
  };
}
