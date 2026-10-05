'use server';

import { getLoginSessionForApi } from '@/lib/login/manage-login';
import { PublicPostForApiDto } from '@/lib/post/schemas';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { revalidateTag } from 'next/cache';

export async function deletePostAction(id: string) {
  const isAuthenticated = await getLoginSessionForApi();

  if (!isAuthenticated) {
    return {
      error: 'Faça login novamente em outra aba',
    };
  }

  if (!id || typeof id !== 'string') {
    return {
      error: 'Dados inválidos',
    };
  }

  const postResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!postResponse.success) {
    return {
      error: 'Erro ao encontrar post',
    };
  }

  const deletePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!deletePostResponse.success) {
    return {
      error: 'Erro ao apagar post',
    };
  }

  revalidateTag('posts', 'max');
  revalidateTag(`post-${postResponse.data.slug}`, 'max');

  return {
    error: '',
  };
}
