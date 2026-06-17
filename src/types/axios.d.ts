// Extiende el tipo de error de Axios para incluir el campo `friendlyMessage`
// que es adjuntado por el interceptor de respuesta en axiosInstance.ts

import type { AxiosError } from 'axios';

declare module 'axios' {
  export interface AxiosError {
    /** Mensaje de error amigable normalizado por el interceptor de axiosInstance */
    friendlyMessage?: string;
  }
}

export {};
