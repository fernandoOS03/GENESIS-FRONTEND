import axios from 'axios';

const hostActual = window.location.hostname;
const urlBackend = `http://${hostActual}:8080`;

const axiosInstance = axios.create({
  baseURL: urlBackend,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ── Request: adjunta el token si existe ──
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response: normaliza errores del backend en mensajes legibles ──
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // Extraer el mensaje del error del backend (Spring Boot puede retornarlo en varios formatos)
    let backendMessage: string | undefined;

    if (typeof data === 'string' && data.trim()) {
      backendMessage = data;
    } else if (data?.mensaje && typeof data.mensaje === 'string') {
      backendMessage = data.mensaje;
    } else if (data?.message && typeof data.message === 'string') {
      backendMessage = data.message;
    } else if (data?.error && typeof data.error === 'string') {
      backendMessage = data.error;
    }

    // Crear un mensaje amigable si no hay mensaje del backend
    if (!backendMessage) {
      switch (status) {
        case 400:
          backendMessage = 'Datos inválidos. Por favor verifica la información ingresada.';
          break;
        case 401:
          backendMessage = 'No autorizado. Tu sesión ha expirado, inicia sesión nuevamente.';
          break;
        case 403:
          backendMessage = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          backendMessage = 'El recurso solicitado no fue encontrado.';
          break;
        case 409:
          backendMessage = 'Conflicto: el recurso ya existe o está en uso.';
          break;
        case 500:
          backendMessage = 'Error interno del servidor. Intenta nuevamente en unos momentos.';
          break;
        default:
          backendMessage = error.message || 'Error de conexión. Verifica tu red e intenta de nuevo.';
      }
    }

    // Adjuntar mensaje normalizado al error para que los servicios lo consuman fácilmente
    error.friendlyMessage = backendMessage;

    // Redirigir a login si token expirado (401) y no estamos ya en /login
    if (status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    console.error(`[API ${status ?? 'ERR'}] ${error.config?.url}:`, backendMessage);
    return Promise.reject(error);
  }
);

export default axiosInstance;
