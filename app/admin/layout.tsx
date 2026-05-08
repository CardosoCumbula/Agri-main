import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgroMoz CMS - Painel Administrativo',
  description: 'Gerenciar produtos do mercado agrícola',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
