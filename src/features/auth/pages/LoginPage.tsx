import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { authService } from '../services/auth.service';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    try {
      const response = await authService.login({
        email: values.email.trim(),
        password: values.password,
      });

      // Guardamos en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirigimos al panel de administración
      navigate('/admin');
    } catch (err: any) {
      // Usar el mensaje amigable del interceptor de axios, o extraer del response
      const friendlyMsg: string =
        err.friendlyMessage ||
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Error de conexión. Por favor verifica tus credenciales.';
      setSubmitError(friendlyMsg);
      toast.error(friendlyMsg);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden font-display bg-background">
      {/* ── LADO IZQUIERDO: Panel de Marca (IYF) ── */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 relative overflow-hidden select-none bg-primary">
        {/* Decoraciones de fondo */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl bg-white" />
        <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl bg-secondary" />

        {/* Header de Marca */}
        <div className="flex items-center gap-3.5 z-10">
          <img src="/logo-iyg.png" alt="Logo IYF" className="h-8 object-contain filter brightness-0 invert" />
        </div>

        {/* Visual de Colaboración */}
        <div className="flex flex-col items-start justify-center flex-1 py-12 z-10 text-left max-w-md animate-fade-up">
          <h2 className="text-3xl font-semibold text-white tracking-tight leading-tight">
            Plataforma de Gestión Administrativa
          </h2>

          <p className="text-[13.5px] mt-5 text-white/80 font-medium leading-relaxed">
            Acceso exclusivo para coordinadores y administradores de la Fraternidad Internacional de Jóvenes (IYF).
            Gestione registros, pagos, logística y participantes desde un solo lugar de manera eficiente.
          </p>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-white/60 z-10 font-mono font-medium">
          © {new Date().getFullYear()} IYF Latinoamérica. Todos los derechos reservados.
        </div>
      </div>

      {/* ── LADO DERECHO: Formulario de Login ── */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-[380px] animate-fade-up">
          {/* Header del formulario (Logo para móvil) */}
          <div className="flex flex-col items-center md:items-start mb-8 text-center md:text-left">
            <div className="md:hidden flex items-center gap-2 mb-4">
              <img src="/logo-iyg.png" alt="Logo IYF" className="h-8 object-contain" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Iniciar Sesión
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Ingresa tus credenciales para acceder al panel de administración.
            </p>
          </div>

          {submitError && (
            <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/20 text-destructive py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-medium">{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Formulario usando Shadcn */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" /> Correo Electrónico
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@iyf.org"
                        className="h-11 rounded-md bg-card border-border shadow-sm focus-visible:ring-primary/20"
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
                      <Lock className="w-3.5 h-3.5" /> Contraseña
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="h-11 rounded-md bg-card border-border shadow-sm focus-visible:ring-primary/20 pr-10"
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

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-11 mt-4 text-[13px] font-bold rounded-md shadow-md transition-all duration-150"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    Verificando…
                  </>
                ) : (
                  'Ingresar al Panel'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
