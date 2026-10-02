import { hashPassword } from '@/lib/login/manage-login';

(async () => {
  const minhaSenha = 'joao9918';
  const hashDaSeha = await hashPassword(minhaSenha);

  console.log({ hashDaSeha });
})();
