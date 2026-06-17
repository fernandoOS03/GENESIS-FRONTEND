import { useState } from 'react';
import { User, Mail, Lock, Shield, AlertCircle, Eye, EyeOff, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { COUNTRY_OPTIONS } from '@/lib/countryOptions';
import type { UserRequest } from '../types/usuarios.types';
import { userSchema, type UserFormValues } from '../schemas/usuarios.schema';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: UserRequest) => Promise<{ success: boolean; error?: string }>;
}

export default function AddUserModal({ open, onClose, onSave }: AddUserModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      rol: 'ROLE_EDITOR',
      pais: '',
      estado: 1,
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setSubmitError(null);
      setShowPassword(false);
      onClose();
    }
  };

  const onSubmit = async (values: UserFormValues) => {
    setSubmitError(null);

    const payload: UserRequest = {
      nombre: values.nombre.trim(),
      email: values.email.trim(),
      rol: values.rol,
      pais: values.pais,
      estado: values.estado,
    };

    if (values.password && values.password.trim() !== '') {
      payload.password = values.password.trim();
    }

    const result = await onSave(payload);

    if (result.success) {
      handleOpenChange(false);
    } else {
      setSubmitError(result.error || 'Ocurrió un error al registrar el usuario.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" className="sm:max-w-md w-full p-0 overflow-hidden bg-card border-r border-border flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-[15px] font-semibold text-foreground">
            Registrar Usuario
          </SheetTitle>
          <SheetDescription className="text-[12px] text-muted-foreground mt-0.5">
            Crea una cuenta para un nuevo administrador o editor.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="px-6 py-5 space-y-4 overflow-y-auto thin-scrollbar max-h-[60vh]">
              {submitError && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{submitError}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 text-muted-foreground">
                      <User className="w-3 h-3" /> Nombre Completo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. Juan Pérez"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] leading-tight text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="w-3 h-3" /> Correo Electrónico
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ejemplo@genesis.com"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] leading-tight text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 text-muted-foreground">
                      <Lock className="w-3 h-3" /> Contraseña
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pr-10"
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px] leading-tight text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pais"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 text-muted-foreground">
                      <Globe className="w-3 h-3" /> País
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar país…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRY_OPTIONS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label} ({c.value})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[11px] leading-tight text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rol"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 text-muted-foreground">
                      <Shield className="w-3 h-3" /> Rol
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar rol…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ROLE_COUNTRY_ADMIN">Administrador</SelectItem>
                        <SelectItem value="ROLE_EDITOR">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[11px] leading-tight text-destructive" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border bg-muted/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={form.formState.isSubmitting}
                className="text-[13px] font-medium"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="gap-2 text-[13px] font-semibold"
              >
                {form.formState.isSubmitting && (
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {form.formState.isSubmitting ? 'Registrando…' : 'Crear usuario'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
