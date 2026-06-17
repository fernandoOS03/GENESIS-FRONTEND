import axiosInstance from '@/api/axiosInstance';
import type { UserRole } from '../../admin/types/usuarios.types';

export interface LoginRequest {
  email: string;
  password: string;
}

// Respuesta cruda del backend en POST /auth
// El backend retorna 'email' en minúscula (campo del UserResponse Java)
export interface ApiUserResponse {
  id: string;
  name: string;
  email: string; // minúscula — coincide con el record UserResponse del backend
  rol: UserRole; // con prefijo ROLE_ (ej: ROLE_EDITOR)
  estado: number;
  pais: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    rol: UserRole;
    estado: number;
    pais: string;
  };
}

export const authService = {
  /**
   * POST /auth
   * Inicia sesión para un administrador/editor
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const res = await axiosInstance.post<{ token: string; user: ApiUserResponse }>('/auth', credentials);
    const { token, user } = res.data;

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email, // minúscula — sin necesidad de remap
        rol: user.rol,
        estado: user.estado,
        pais: user.pais,
      },
    };
  },
};
