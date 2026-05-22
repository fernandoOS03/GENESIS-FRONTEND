import axiosInstance from '@/api/axiosInstance';
import type { ParticipanteFormData } from '../types/participante.types';
import type { ViajeFormData } from '../../viaje/types/viaje.types';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

/**
 * Sube un archivo directamente a Cloudinary (unsigned upload).
 * Cloudinary responde con la URL pública.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? 'Error al subir el archivo a Cloudinary.');
  }

  const data = await res.json();
  return data.secure_url as string;
}

export const participanteService = {
  /**
   * Crea un participante enviando todos los datos (boletoUrl ya es la URL de Cloudinary).
   */
  create: async (data: ParticipanteFormData) => {
    // boletoNombre es solo visual — no se envía al backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { boletoNombre, ...rest } = data;

    // Normalizar: convertir cadenas vacías a null
    const body = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [k, v === '' ? null : v])
    );

    const response = await axiosInstance.post('/api/v1/participantes', body);
    return response.data;
  },

  /**
   * Actualiza únicamente los datos de viaje/transporte enviando el JWT token.
   * Hace PATCH /api/v1/participantes/viaje
   */
  updateViaje: async (token: string, data: ViajeFormData) => {
    // boletoNombre es solo visual — no se envía al backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { boletoNombre, ...rest } = data;

    // Normalizar: convertir cadenas vacías a null
    const body = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [k, v === '' ? null : v])
    );

    const response = await axiosInstance.patch(`/api/v1/participantes/viaje`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
};