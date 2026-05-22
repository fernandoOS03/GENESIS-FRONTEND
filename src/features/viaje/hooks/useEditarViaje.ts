import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  type ViajeFormData,
  type ViajeValidationErrors,
  initialViajeData,
} from '../types/viaje.types';
import { TipoTransporte } from '../../formulario/types/participante.types';
import { participanteService, uploadToCloudinary } from '../../formulario/services/participante.service';

// ── Validación ──

function validateViaje(d: ViajeFormData): ViajeValidationErrors {
  const errors: ViajeValidationErrors = {};

  if (!d.tipoTransporte) {
    errors.tipoTransporte = 'Selecciona un medio de transporte.';
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

// ── Hook ──

export function useEditarViaje() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState<ViajeFormData>(initialViajeData);
  const [validationErrors, setValidationErrors] = useState<ViajeValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);

  // ── Validación Instantánea del JWT en el Frontend ──
  useEffect(() => {
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) throw new Error("No payload");
        
        const decodedString = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const decodedPayload = JSON.parse(decodedString);
        
        if (decodedPayload.exp) {
          const expirationTime = decodedPayload.exp * 1000; // a ms
          if (Date.now() >= expirationTime) {
            setIsTokenInvalid(true);
          }
        }
      } catch {
        setIsTokenInvalid(true);
      }
    }
  }, [token]);

  const updateField = useCallback(
    <K extends keyof ViajeFormData>(field: K, value: ViajeFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    },
    []
  );

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, boletoUrl: url, boletoNombre: file.name }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir el archivo.';
      setUploadError(msg);
      setFormData((prev) => ({ ...prev, boletoUrl: null, boletoNombre: '' }));
    } finally {
      setUploading(false);
    }
  }, []);

  const removeFile = useCallback(() => {
    setFormData((prev) => ({ ...prev, boletoUrl: null, boletoNombre: '' }));
    setUploadError(null);
  }, []);

  const submit = useCallback(async () => {
    if (!token) {
      setError('Enlace inválido o ausente.');
      setIsTokenInvalid(true);
      return;
    }

    const errs = validateViaje(formData);
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await participanteService.updateViaje(token, formData);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 401) {
          setIsTokenInvalid(true);
          return;
        }
      }
      const msg = err instanceof Error ? err.message : 'Error al guardar los datos de viaje.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [token, formData]);

  return {
    token,
    formData,
    validationErrors,
    isSubmitting,
    isSuccess,
    error,
    uploading,
    uploadError,
    isTokenInvalid,
    updateField,
    handleFileUpload,
    removeFile,
    submit,
  };
}
