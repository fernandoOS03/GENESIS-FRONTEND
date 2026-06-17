// Valores exactos del enum UsersEnum en el backend (con prefijo ROLE_)
export type UserRole = 'ROLE_SUPER_ADMIN' | 'ROLE_COUNTRY_ADMIN' | 'ROLE_EDITOR';

// Etiquetas legibles para mostrar en la UI
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ROLE_SUPER_ADMIN: 'Super Admin',
  ROLE_COUNTRY_ADMIN: 'Country Admin',
  ROLE_EDITOR: 'Editor',
};

export interface User {
  id: string;
  name: string;
  email: string;
  rol: UserRole;
  pais: string;
  estado: number; // 1 = Activo, 0 = Desactivado
}

// Campos que espera el backend en POST /api/usuarios/registrar
export interface UserRequest {
  nombre: string;
  email: string;
  password?: string;
  rol: UserRole;
  pais: string;
  estado: number;
}
