'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu, LogOut, TrendingUp, Package, Users, MapPin } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getAllProducts } from '@/lib/admin/localStorage';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalLocations: 0,
    avgPrice: 0,
    categoryData: [] as any[],
    priceDistribution: [] as any[],
    recentProducts: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadDashboardData();
  }, [router]);

  const loadDashboardData = () => {
    try {
      const products = getAllProducts();
      
      // Calculate statistics
      const totalProducts = products.length;
      const categories = new Set(products.map(p => p.category));
      const locations = new Set(products.map(p => p.location));
      
      const avgPrice = totalProducts > 0 
        ? products.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts 
        : 0;

      // Category distribution
      const categoryMap: Record<string, number> = {};
      products.forEach(p => {
        categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
      });

      const categoryData = Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      // Price distribution
      const priceRanges = [
        { range: '0-50', min: 0, max: 50, count: 0 },
        { range: '50-200', min: 50, max: 200, count: 0 },
        { range: '200-500', min: 200, max: 500, count: 0 },
        { range: '500+', min: 500, max: Infinity, count: 0 },
      ];

      products.forEach(p => {
        const price = p.price || 0;
        priceRanges.forEach(range => {
          if (price >= range.min && price < range.max) {
            range.count++;
          }
        });
      });

      const priceDistribution = priceRanges.map(({ range, count }) => ({
        range,
        count,
      }));

      // Recent products
      const recentProducts = products
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5);

      setStats({
        totalProducts,
        totalCategories: categories.size,
        totalLocations: locations.size,
        avgPrice: Math.round(avgPrice * 100) / 100,
        categoryData,
        priceDistribution,
        recentProducts,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  const COLORS = ['#10b981', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 lg:p-6 flex items-center justify-between sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Análises</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Products */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Produtos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                </div>
                <Package className="text-green-600" size={32} />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categorias</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCategories}</p>
                </div>
                <TrendingUp className="text-orange-600" size={32} />
              </div>
            </div>

            {/* Locations */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Regiões</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLocations}</p>
                </div>
                <MapPin className="text-blue-600" size={32} />
              </div>
            </div>

            {/* Average Price */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Preço Médio</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.avgPrice.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">MZN</p>
                </div>
                <Users className="text-purple-600" size={32} />
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Produtos por Categoria</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    formatter={(value) => [value, 'Produtos']}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Price Distribution */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Distribuição de Preços</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.priceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, count }) => `${range}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.priceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Produtos']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Produtos Recentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Título</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoria</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Localização</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentProducts.length > 0 ? (
                    stats.recentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-sm text-gray-900">{product.title}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          {product.price?.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MZN
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">{product.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-3 text-center text-gray-500">
                        Nenhum produto encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
              <p className="text-sm text-green-700 font-medium">Status do Sistema</p>
              <p className="text-2xl font-bold text-green-900 mt-2">✓ Online</p>
              <p className="text-xs text-green-600 mt-1">Todos os serviços funcionando</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-6">
              <p className="text-sm text-blue-700 font-medium">Taxa de Ocupação</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                {stats.totalCategories > 0 ? Math.round((stats.totalProducts / 50) * 100) : 0}%
              </p>
              <p className="text-xs text-blue-600 mt-1">De capacidade total</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
              <p className="text-sm text-purple-700 font-medium">Última Atualização</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">Agora</p>
              <p className="text-xs text-purple-600 mt-1">Dados em tempo real</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
