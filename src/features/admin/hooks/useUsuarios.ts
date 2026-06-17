import { useState, useEffect } from 'react';
import { usuariosService } from '../services/usuarios.service';
import type { User, UserRequest } from '../types/usuarios.types';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuariosService.getUsuarios();
      setUsuarios(data);
    } catch (err: any) {
      console.error('Error al obtener usuarios de la API:', err);
      const msg: string =
        err.friendlyMessage ||
        err.response?.data?.message ||
        'Error al cargar los usuarios del servidor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const registrarUsuario = async (data: UserRequest) => {
    try {
      const nuevoUsuario = await usuariosService.registrarUsuario(data);
      // Actualizamos el estado local agregando el usuario retornado
      setUsuarios((prev) => [nuevoUsuario, ...prev]);
      return { success: true };
    } catch (err: any) {
      console.error('Error al registrar usuario en la API:', err);
      const errorMsg: string =
        err.friendlyMessage ||
        err.response?.data?.message ||
        'Error de conexión con el servidor. No se pudo registrar el usuario.';
      return { success: false, error: errorMsg };
    }
  };

  const eliminarUsuario = (id: string) => {
    // La eliminación se mantiene 100% de manera local como se solicitó
    setUsuarios((prev) => prev.filter((user) => user.id !== id));
  };

  return {
    usuarios,
    loading,
    error,
    registrarUsuario,
    eliminarUsuario,
    refetch: fetchUsuarios,
  };
}
