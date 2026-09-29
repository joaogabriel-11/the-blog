import { z } from 'zod';

// Uma base para a validação do usuário
// Criei essa base para usar .refine e .transform
// e validar se a duas senhas são iguais e remover
// a repetição da senha
const CreateUserBase = z.object({
  name: z.string().trim().min(4, 'Nome precisa ter um mínimo de 4 caracteres'),
  email: z.string().trim().email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .trim()
    .min(6, 'Senha precisa ter um mínimo de 6 caracteres'),
  password2: z
    .string()
    .trim()
    .min(6, 'Confirmação de senha precisa ter um mínimo de 6 caracteres'),
});

export const CreateUserSchema = CreateUserBase.refine(
  data => {
    // Confirma se password e password2 são iguais
    return data.password === data.password2;
  },
  {
    path: ['password2'], // aponta o erro pro campo de confirmação
    message: 'As senhas não conferem',
  },
).transform(({ email, name, password }) => {
  // Remove o campo password2
  return {
    name,
    email,
    password,
  };
});

export const PublicUserSchema = z.object({
  id: z.string().default(''),
  name: z.string().default(''),
  email: z.string().default(''),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(6, 'Senha precisa ter um mínimo de 6 caracteres'),
    newPassword: z
      .string()
      .trim()
      .min(6, 'Nova senha precisa ter um mínimo de 6 caracteres'),
    newPassword2: z
      .string()
      .trim()
      .min(6, 'Confirmação de senha precisa ter um mínimo de 6 caracteres'),
  })
  .refine(
    data => {
      // Confirma se newPassword e newPassword2 são iguais
      return data.newPassword === data.newPassword2;
    },
    {
      path: ['newPassword2'], // aponta o erro pro campo de confirmação
      message: 'As senhas não conferem',
    },
  )
  .transform(({ currentPassword, newPassword }) => {
    // Remove o campo newPassword2
    return {
      currentPassword,
      newPassword,
    };
  });

export const UpdateUserSchema = CreateUserBase.omit({
  password: true,
  password2: true,
}).extend({});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type PublicUserDto = z.infer<typeof PublicUserSchema>;
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
