import axiosInstance from '@/api/axiosInstance';
import type { User, UserRequest, UserRole } from '../types/usuarios.types';

// Respuesta del backend en GET /api/usuarios (UserListResponse Java)
export interface ApiUserListResponse {
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  pais: string;
  estado: number;
}

// Respuesta del backend en POST /api/usuarios/registrar (UserResponse Java)
export interface ApiUserResponse {
  id: string;
  name: string;
  email: string;
  rol: UserRole;
  estado: number;
  pais: string;
}

export const usuariosService = {
  /**
   * GET /api/usuarios
   * Obtiene la lista de todos los usuarios
   */
  getUsuarios: async (): Promise<User[]> => {
    const res = await axiosInstance.get<ApiUserListResponse[]>('/api/usuarios');
    return res.data.map((u, index) => ({
      id: u.email || `usr-${index}`, // Usamos email como ID único ya que la lista no incluye UUID
      name: u.nombre,
      email: u.email,
      rol: u.rol,
      pais: u.pais || '',
      estado: u.estado ?? 1,
    }));
  },

  /**
   * POST /api/usuarios/registrar
   * Registra un nuevo usuario en la base de datos
   */
  registrarUsuario: async (data: UserRequest): Promise<User> => {
    const res = await axiosInstance.post<ApiUserResponse>('/api/usuarios/registrar', data);
    return {
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
      rol: res.data.rol,
      pais: res.data.pais || '',
      estado: res.data.estado ?? 1,
    };
  },
};
