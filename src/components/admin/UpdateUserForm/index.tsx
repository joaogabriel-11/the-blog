'use client';

import { updateUserAction } from '@/actions/user/update-user-action';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { InputText } from '@/components/InputText';
import { PublicUserDto } from '@/lib/user/schemas';
import { asyncDelay } from '@/utils/async-delay';
import clsx from 'clsx';
import { LockKeyholeIcon, OctagonXIcon, UserPenIcon } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { toast } from 'react-toastify';

type UpdateUserFormProps = {
  user: PublicUserDto;
};

export function UpdateUserForm({ user }: UpdateUserFormProps) {
  const [state, action, isPending] = useActionState(updateUserAction, {
    user,
    errors: [],
    success: false,
  });
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isTransitioning, startTransition] = useTransition();
  const safetyDelay = 10000;
  const isElementsDisabled = isTransitioning || isPending;

  function showDeleteAccountDialog(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    e.preventDefault();
    setIsDialogVisible(true);

    startTransition(async () => {
      await asyncDelay(safetyDelay);
    });
  }

  function handleDeleteUserAccount() {
    //
  }

  useEffect(() => {
    toast.dismiss();

    if (state.errors.length > 0) {
      state.errors.forEach(error => toast.error(error));
    }

    if (state.success) {
      toast.success('Atualizado com sucesso');
    }
  }, [state]);

  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        'text-center max-w-sm mt-16 mb-32 mx-auto',
      )}
    >
      <form action={action} className='flex-1 flex flex-col gap-6'>
        <InputText
          type='text'
          name='name'
          labelText='Nome'
          placeholder='Seu nome'
          disabled={isElementsDisabled}
          defaultValue={state.user.name}
        />

        <InputText
          type='text'
          name='email'
          labelText='E-mail'
          placeholder='Seu e-mail'
          disabled={isElementsDisabled}
          defaultValue={state.user.email}
        />

        <div className='flex items-center justify-center mt-4'>
          <Button size='md' disabled={isElementsDisabled} type='submit'>
            <UserPenIcon />
            Atualizar
          </Button>
        </div>

        <div className='flex gap-4 items-center justify-between mt-8'>
          <Link
            className={clsx(
              'flex gap-2 items-center justify-center transition',
              'hover:text-blue-600',
            )}
            href='/admin/user/password'
          >
            <LockKeyholeIcon />
            Trocar senha
          </Link>

          <Link
            className={clsx(
              'flex gap-2 items-center justify-center transition',
              'text-red-600 hover:text-red-700',
            )}
            href='#'
            onClick={showDeleteAccountDialog}
          >
            <OctagonXIcon />
            Apagar conta
          </Link>
        </div>
      </form>

      <Dialog
        content={
          <p>
            Ao apagar meu usuário, meus dados e todos os meus posts também serão
            excluídos. Essa ação é IRREVERSÍVEL. Em alguns segundos os botões
            serão liberados. Clique em <b>OK</b> para confirmar ou{' '}
            <b>Cancelar</b> para fechar essa janela.
          </p>
        }
        disabled={isElementsDisabled}
        onCancel={() => setIsDialogVisible(false)}
        onConfirm={handleDeleteUserAccount}
        isVisible={isDialogVisible}
        title='Apagar meu usuário'
      />
    </div>
  );
}
