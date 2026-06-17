import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'El correo electrónico es obligatorio' }).email({ message: 'El formato de correo no es válido' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
