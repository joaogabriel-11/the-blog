'use server';

import {
  CreateUserSchema,
  PublicUserDto,
  PublicUserSchema,
} from '@/lib/user/schemas';
import { apiRequest } from '@/utils/api-request';
import { asyncDelay } from '@/utils/async-delay';
import { getZodErrorMessages } from '@/utils/get-zod-error-messages';
import { redirect } from 'next/navigation';

type CreateUserActionState = {
  user: PublicUserDto;
  errors: string[];
  success: boolean;
};

export async function createUserAction(
  state: CreateUserActionState,
  formData: FormData,
): Promise<CreateUserActionState> {
  await asyncDelay(3000);

  if (!(formData instanceof FormData)) {
    return {
      user: state.user,
      errors: ['Dados inválidos'],
      success: false,
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const parsedFormData = CreateUserSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      user: PublicUserSchema.parse(formObj),
      errors: getZodErrorMessages(parsedFormData.error.format()),
      success: false,
    };
  }

  const createResponse = await apiRequest<PublicUserDto>('/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedFormData.data),
  });

  if (!createResponse.success) {
    return {
      user: PublicUserSchema.parse(formObj),
      errors: createResponse.errors,
      success: createResponse.success,
    };
  }

  redirect('/login?created=1');
}
