import type { Metadata } from 'next';
import { AdminProtection } from '@/hooks/useAdminAuth';

export const metadata: Metadata = {
  title: 'AgroMoz CMS - Painel Administrativo',
  description: 'Gerenciar produtos do mercado agrícola',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtection>
      {children}
    </AdminProtection>
  );
}
