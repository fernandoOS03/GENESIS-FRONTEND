import { useState } from 'react';
import { useUsuarios } from '../hooks/useUsuarios';
import AddUserModal from '../components/AddUserModal';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  UserCog, 
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import type { User, UserRole } from '../types/usuarios.types';
import { USER_ROLE_LABELS } from '../types/usuarios.types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function UsuariosPage() {
  const { usuarios, loading, error, registrarUsuario, eliminarUsuario } = useUsuarios();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Filter users based on search query
  const filteredUsers = usuarios.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q) ||
      (u.rol ?? '').toLowerCase().includes(q) ||
      (u.pais ?? '').toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const stats = {
    total: usuarios.length,
    superAdmin: usuarios.filter((u) => u.rol === 'ROLE_SUPER_ADMIN').length,
    countryAdmin: usuarios.filter((u) => u.rol === 'ROLE_COUNTRY_ADMIN').length,
    editor: usuarios.filter((u) => u.rol === 'ROLE_EDITOR').length,
  };

  const handleRegister = async (data: any) => {
    const res = await registrarUsuario(data);
    if (res.success) {
      toast.success('Usuario registrado correctamente 🎉');
      return { success: true };
    } else {
      toast.error(res.error || 'Error al registrar el usuario.');
      return { success: false, error: res.error };
    }
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      eliminarUsuario(userToDelete.id);
      toast.success(`Usuario "${userToDelete.name}" eliminado correctamente`);
      setUserToDelete(null);
    }
  };

  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        return (
          <Badge variant="outline" className="gap-1 text-[#0070A3] border-transparent font-medium shadow-none">
            <ShieldAlert className="w-3 h-3" />
            {USER_ROLE_LABELS[role]}
          </Badge>
        );
      case 'ROLE_COUNTRY_ADMIN':
        return (
          <Badge variant="outline" className="gap-1 text-[#92400E] border-transparent font-medium shadow-none">
            <ShieldCheck className="w-3 h-3" />
            {USER_ROLE_LABELS[role]}
          </Badge>
        );
      case 'ROLE_EDITOR':
      default:
        return (
          <Badge variant="outline" className="gap-1 text-[#065F46] border-transparent font-medium shadow-none">
            <UserCog className="w-3 h-3" />
            {USER_ROLE_LABELS[role] ?? role}
          </Badge>
        );
    }
  };

  const renderStatusBadge = (estado: number) => {
    if (estado === 1) {
      return (
        <Badge variant="outline" className="border-transparent text-emerald-700 bg-emerald-50 font-medium shadow-none">
          Activo
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-transparent font-medium shadow-none hover:bg-destructive/10">
          Desactivado
        </Badge>
      );
    }
  };

  const estados = [
    { label: 'Total', value: stats.total, color: 'text-foreground', info: 'Todos los usuarios registrados en el sistema.' },
    { label: 'Super Admins', value: stats.superAdmin, color: 'text-blue-600', info: 'Usuarios con acceso total a la plataforma.' },
    { label: 'Administradores', value: stats.countryAdmin, color: 'text-orange-500', info: 'Usuarios que administran participantes de su país.' },
    { label: 'Editores', value: stats.editor, color: 'text-emerald-600', info: 'Usuarios encargados de soporte y registros.' },
  ];

  return (
    <>
      <div className="animate-fade-up space-y-6 mt-2 max-w-[1400px] mx-auto relative z-10 px-4 sm:px-6 md:px-8 py-6">
        
        {/* Top States Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {estados.map(estado => (
            <Card key={estado.label} className="border-border/40 shadow-sm relative group overflow-visible">
              <CardContent className="p-4 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 cursor-help">
                  {estado.label}
                </p>
                <p className={`text-2xl font-bold font-mono leading-none ${estado.color}`}>
                  {estado.value}
                </p>
              </CardContent>
              {/* Tooltip on hover */}
              <div className="absolute top-[110%] left-1/2 -translate-x-1/2 w-48 p-2.5 bg-secondary text-secondary-foreground text-xs rounded-xl shadow-modern opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                {estado.info}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-secondary rotate-45"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Error notification */}
        {error && (
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Users Table Card */}
        <Card className="border-border/40 shadow-modern overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-border/40 bg-card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Directorio de Cuentas</CardTitle>
                <CardDescription className="mt-1">Administra los accesos y credenciales del sistema.</CardDescription>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuario…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background"
                  />
                </div>
                <Button onClick={() => setShowAddModal(true)} size="sm" className="h-9 gap-2">
                  <Plus className="w-4 h-4" />
                  Nuevo
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] font-semibold uppercase tracking-widest px-6 h-11">Usuario</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-widest px-6 h-11">Correo</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-widest px-6 h-11 text-center">País</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-widest px-6 h-11">Rol</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-widest px-6 h-11">Estado</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded w-32" /></TableCell>
                      <TableCell className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded w-48" /></TableCell>
                      <TableCell className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded w-16 mx-auto" /></TableCell>
                      <TableCell className="px-6 py-4"><div className="h-5 bg-muted animate-pulse rounded-full w-24" /></TableCell>
                      <TableCell className="px-6 py-4"><div className="h-5 bg-muted animate-pulse rounded-full w-16" /></TableCell>
                      <TableCell className="px-6 py-4"></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u.id} className="group">
                      <TableCell className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                            {u.name.substring(0, 2)}
                          </div>
                          <span className="font-medium text-foreground">{u.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3 text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="px-6 py-3 text-center">
                        <Badge variant="secondary" className="font-mono bg-muted text-muted-foreground hover:bg-muted font-bold text-[11px] shadow-none">
                          {u.pais}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-3">{renderRoleBadge(u.rol)}</TableCell>
                      <TableCell className="px-6 py-3">{renderStatusBadge(u.estado)}</TableCell>
                      <TableCell className="px-6 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setUserToDelete(u)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AddUserModal open={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleRegister} />

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => { if (!open) setUserToDelete(null) }}>
        <AlertDialogContent className="bg-card border-border shadow-modal rounded-xl sm:max-w-md">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center text-lg font-bold">¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm">
              Esta acción eliminará a <strong className="text-foreground">{userToDelete?.name}</strong> del sistema. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center flex-row gap-3 mt-4">
            <AlertDialogCancel className="w-full mt-0">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
