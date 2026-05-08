'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getProductStats } from '@/lib/admin/localStorage';
import { Menu, Package, TrendingUp, Loader2, LogOut, ShoppingCart, Tag } from 'lucide-react';

interface Stats {
  totalProducts: number;
  sellProducts: number;
  buyProducts: number;
  categories: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const data = await getProductStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="bg-white border-b border-gray-200 p-4 lg:p-6 flex items-center justify-between sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Análise e Relatórios</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-green-600" size={32} />
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Products */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Total de Produtos</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                    <Package className="text-green-600" size={32} />
                  </div>
                </div>

                {/* Sell Products */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Para Vender</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.sellProducts}</p>
                    </div>
                    <ShoppingCart className="text-blue-600" size={32} />
                  </div>
                </div>

                {/* Buy Products */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Para Comprar</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.buyProducts}</p>
                    </div>
                    <TrendingUp className="text-purple-600" size={32} />
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Categorias</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
                    </div>
                    <Tag className="text-orange-600" size={32} />
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Distribuição por Categoria</h2>
                {stats.categoryBreakdown.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">Nenhuma categoria ainda</p>
                ) : (
                  <div className="space-y-4">
                    {stats.categoryBreakdown.map((item) => {
                      const percentage = stats.totalProducts > 0 
                        ? (item.count / stats.totalProducts) * 100 
                        : 0;
                      return (
                        <div key={item.category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{item.category}</span>
                            <span className="text-gray-600 text-sm">
                              {item.count} produto{item.count !== 1 ? 's' : ''} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Falha ao carregar análise
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
