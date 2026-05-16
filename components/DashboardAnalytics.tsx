'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, ShoppingCart, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { LoadingSkeleton } from '@/components/common/LoadingStates';
import { getAllProducts } from '@/lib/admin/localStorage';

interface DashboardStats {
  totalProducts: number;
  sellProducts: number;
  buyProducts: number;
  avgPrice: number;
  categories: Array<{ name: string; count: number }>;
  recentActivity: Array<{ date: string; sales: number }>;
}

export function DashboardAnalytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      try {
        const products = getAllProducts();
        
        const sellProducts = products.filter(p => p.type === 'sell');
        const buyProducts = products.filter(p => p.type === 'buy');
        const categories = [
          ...new Set(products.map(p => p.category))
        ].map(cat => ({
          name: cat,
          count: products.filter(p => p.category === cat).length
        }));

        const avgPrice = products.length > 0
          ? Math.round((products.reduce((sum, p) => sum + p.price, 0) / products.length) * 100) / 100
          : 0;

        // Generate mock activity data
        const recentActivity = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (7 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' }),
          sales: Math.floor(Math.random() * 50) + 10
        }));

        setStats({
          totalProducts: products.length,
          sellProducts: sellProducts.length,
          buyProducts: buyProducts.length,
          avgPrice,
          categories,
          recentActivity
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton count={4} variant="card" />;
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-600">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-stone-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-stone-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          label="Total de Produtos"
          value={stats.totalProducts}
          color="bg-emerald-600"
          trend="+12% vs semana anterior"
        />
        <StatCard
          icon={ShoppingCart}
          label="Para Vender"
          value={stats.sellProducts}
          color="bg-blue-600"
          trend="+8% vs semana anterior"
        />
        <StatCard
          icon={ShoppingCart}
          label="Para Comprar"
          value={stats.buyProducts}
          color="bg-orange-600"
          trend="+15% vs semana anterior"
        />
        <StatCard
          icon={TrendingUp}
          label="Preço Médio"
          value={`MZN ${stats.avgPrice}`}
          color="bg-purple-600"
          trend="+5% vs semana anterior"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
        >
          <h3 className="font-bold text-stone-900 mb-4">Atividade Recente (7 dias)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.recentActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="date" stroke="#78716c" />
              <YAxis stroke="#78716c" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fafaf8',
                  border: '1px solid #d6d3d1',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#059669"
                strokeWidth={2}
                dot={{ fill: '#059669' }}
                name="Vendas"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
        >
          <h3 className="font-bold text-stone-900 mb-4">Distribuição por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="name" stroke="#78716c" />
              <YAxis stroke="#78716c" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fafaf8',
                  border: '1px solid #d6d3d1',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#059669" radius={[8, 8, 0, 0]} name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
      >
        <h3 className="font-bold text-stone-900 mb-6">Categorias</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.categories.map((category) => (
            <div key={category.name} className="p-4 bg-stone-50 rounded-lg border border-stone-200">
              <p className="text-stone-600 text-sm font-medium">{category.name}</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">{category.count}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardAnalytics;
