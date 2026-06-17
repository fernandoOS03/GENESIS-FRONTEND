import { z } from 'zod';

export const userSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Debe ser un correo válido' }),
  password: z.string().optional(),
  rol: z.enum(['ROLE_SUPER_ADMIN', 'ROLE_COUNTRY_ADMIN', 'ROLE_EDITOR'] as const, {
    required_error: 'Debe seleccionar un rol',
  }),
  pais: z.string().min(2, { message: 'Debe seleccionar un país' }),
  estado: z.number().default(1),
});

export type UserFormValues = z.infer<typeof userSchema>;
