'use server';

import { deleteLoginSession } from '@/lib/login/manage-login';
import { getPublicUserFromApi } from '@/lib/user/api/get-user';
import {
  PublicUserDto,
  PublicUserSchema,
  UpdateUserSchema,
} from '@/lib/user/schemas';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/utils/get-zod-error-messages';
import { redirect } from 'next/navigation';

type UpdateUserActionState = {
  user: PublicUserDto;
  errors: string[];
  success: boolean;
};

export async function updateUserAction(
  state: UpdateUserActionState,
  formData: FormData,
): Promise<UpdateUserActionState> {
  const user = await getPublicUserFromApi();

  if (!user) {
    await deleteLoginSession();

    return {
      user: state.user,
      errors: ['Você precisa fazer login novamente'],
      success: false,
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      user: state.user,
      errors: ['Dados inválidos'],
      success: false,
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const parsedFormData = UpdateUserSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      user: PublicUserSchema.parse(formObj),
      errors: getZodErrorMessages(parsedFormData.error.format()),
      success: false,
    };
  }

  const updateResponse = await authenticatedApiRequest<PublicUserDto>(
    `/user/me`,
    {
      method: 'PATCH',
      body: JSON.stringify(parsedFormData.data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!updateResponse.success) {
    return {
      user: PublicUserSchema.parse(formObj),
      errors: updateResponse.errors,
      success: false,
    };
  }

  if (user.email !== updateResponse.data.email) {
    await deleteLoginSession();
    redirect('/login?userChanged=1');
  }

  // Isso aqui é a lista de posts
  // Não vai atualizar o single post
  // O nome de usuário (caso atualizado) só vai mudar
  // após o revalidate por conta do cache
  // revalidateTag('posts');

  return {
    user: PublicUserSchema.parse(updateResponse.data),
    errors: [],
    success: true,
  };
}
