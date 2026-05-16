'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardAnalytics } from '@/components/DashboardAnalytics';
import { Menu, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-stone-200 p-4 lg:p-6 flex items-center justify-between sticky top-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-stone-600 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-2"
              aria-label="Toggle navigation"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-stone-900">Análise e Relatórios</h1>
              <p className="text-stone-600 text-sm mt-1">Visualize estatísticas e desempenho</p>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Sair"
          >
            <LogOut size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Sair</span>
          </motion.button>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 lg:p-8 max-w-7xl mx-auto"
        >
          <DashboardAnalytics />
        </motion.div>
      </main>
    </div>
  );
}
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
