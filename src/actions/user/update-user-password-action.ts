'use server';

import { deleteLoginSession } from '@/lib/login/manage-login';
import { getPublicUserFromApi } from '@/lib/user/api/get-user';
import { UpdatePasswordSchema } from '@/lib/user/schemas';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/utils/get-zod-error-messages';
import { redirect } from 'next/navigation';

type UpdatePasswordActionState = {
  errors: string[];
  success: boolean;
};

export async function updatePasswordAction(
  state: UpdatePasswordActionState,
  formData: FormData,
): Promise<UpdatePasswordActionState> {
  const user = await getPublicUserFromApi();

  if (!user) {
    await deleteLoginSession();

    return {
      errors: ['Você precisa fazer login novamente'],
      success: false,
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      errors: ['Dados inválidos'],
      success: false,
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const parsedFormData = UpdatePasswordSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      errors: getZodErrorMessages(parsedFormData.error.format()),
      success: false,
    };
  }

  const updatePasswordRes = await authenticatedApiRequest(`/user/me/password`, {
    method: 'PATCH',
    body: JSON.stringify(parsedFormData.data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!updatePasswordRes.success) {
    return {
      errors: updatePasswordRes.errors,
      success: false,
    };
  }

  await deleteLoginSession();
  redirect('/login?userChanged=1');
}
