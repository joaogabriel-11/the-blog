'use server';

import { put } from '@vercel/blob';
import { getLoginSessionForApi } from '@/lib/login/manage-login';

type UploadImageActionResult = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadImageActionResult> {
  const makeResult = ({ url = '', error = '' }) => ({ url, error });

  const isAuthenticated = await getLoginSessionForApi();

  if (!isAuthenticated) {
    return makeResult({ error: 'Faça login novamente' });
  }

  if (!(formData instanceof FormData)) {
    return makeResult({ error: 'Dados inválidos' });
  }

  const file = formData.get('file');

  if (!(file instanceof File)) {
    return makeResult({ error: 'Arquivo inválido' });
  }

  const uploadMaxSize =
    Number(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE) || 921600;
  if (file.size > uploadMaxSize) {
    return makeResult({ error: 'Arquivo muito grande' });
  }

  if (!file.type.startsWith('image/')) {
    return makeResult({ error: 'Imagem inválida' });
  }

  try {
    const blob = await put(`posts/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });

    return makeResult({ url: blob.url });
  } catch (error) {
    console.error('Erro ao enviar imagem para o Vercel Blob:', error);
    return makeResult({ error: 'Não foi possível enviar a imagem' });
  }
}
