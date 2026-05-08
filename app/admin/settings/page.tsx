'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu, LogOut } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const email = typeof window !== 'undefined' ? localStorage.getItem('admin_email') : '';

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="bg-gray-800 border-b border-gray-700 p-4 lg:p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold">Configurações</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>

        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Account Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Informações da Conta</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email || ''}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* CMS Features */}
            <div className="border-t border-gray-700 pt-8">
              <h2 className="text-xl font-bold mb-4">Recursos do CMS</h2>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Criar, Ler, Atualizar, Deletar produtos</li>
                <li>✓ Pesquisar e filtrar produtos</li>
                <li>✓ Gerenciamento de categorias</li>
                <li>✓ Análise e estatísticas</li>
                <li>✓ Dados armazenados localmente</li>
              </ul>
            </div>

            {/* Demo Credentials */}
            <div className="border-t border-gray-700 pt-8">
              <h2 className="text-xl font-bold mb-4">Credenciais de Demonstração</h2>
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 space-y-2 text-sm">
                <p><strong>Email:</strong> admin@agromoz.com</p>
                <p><strong>Senha:</strong> admin123</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
