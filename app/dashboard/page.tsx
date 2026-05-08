'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();

  React.useEffect(() => {
    // Redirect to admin products page for proper product management
    router.push('/admin/products');
  }, [router]);

  // Dashboard redirects to /admin/products

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <Package className="w-16 h-16 text-emerald-600 animate-pulse" />
        <h1 className="text-3xl font-bold text-slate-900">Redirecionando...</h1>
        <p className="text-slate-600 max-w-md text-center">Você está sendo direcionado para o painel de gestão de produtos.</p>
      </div>
    </main>
  );
}
