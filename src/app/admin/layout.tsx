import { MenuAdmin } from '@/components/admin/MenuAdmin';
import { requireLoginSessionForApiOrRedirect } from '@/lib/login/manage-login';

type AdminPostLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPostLayout({
  children,
}: Readonly<AdminPostLayoutProps>) {
  await requireLoginSessionForApiOrRedirect();

  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}
