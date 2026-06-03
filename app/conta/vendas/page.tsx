'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getOrdersByFarmer, updateOrderStatus } from '@/lib/firestore/orders';
import { Order, OrderStatus } from '@/lib/types';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/components/Toast';

export default function SalesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }

      if (user.role !== 'farmer') {
        router.push('/');
        return;
      }

      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (user?.uid) {
        const data = await getOrdersByFarmer(user.uid);
        setOrders(data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      addToast('Erro ao carregar vendas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      addToast('Status da encomenda atualizado com sucesso!', 'success');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      addToast('Erro ao atualizar encomenda', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };
    return transitions[currentStatus] || [];
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    };
    return labels[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'delivered').length,
    total: orders.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Minhas Vendas</h1>
              <p className="text-gray-600 mt-1">Total de {stats.total} encomenda{stats.total !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Pendentes', value: stats.pending, color: 'bg-yellow-100 text-yellow-800' },
              { label: 'Enviadas', value: stats.shipped, color: 'bg-purple-100 text-purple-800' },
              { label: 'Entregues', value: stats.completed, color: 'bg-green-100 text-green-800' },
              { label: 'Total', value: stats.total, color: 'bg-blue-100 text-blue-800' },
            ].map((stat) => (
              <div key={stat.label} className={`p-4 rounded-lg ${stat.color}`}>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'pending', label: 'Pendentes' },
            { key: 'shipped', label: 'Enviadas' },
            { key: 'delivered', label: 'Entregues' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeFilter === filter.key
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">
              Nenhuma encomenda neste filtro
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusLabel(order.status);
              const nextStatuses = getStatusOptions(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{order.productName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Comprador: <span className="font-medium">{order.buyerName}</span>
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Quantidade</span>
                      <p className="font-medium">{order.quantity} {order.unit}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Preço Unitário</span>
                      <p className="font-medium">{order.unitPrice.toFixed(2)} MT</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total</span>
                      <p className="font-medium text-green-600">{order.totalPrice.toFixed(2)} MT</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Data</span>
                      <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('pt-MZ')}</p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notas:</span> {order.notes}
                      </p>
                    </div>
                  )}

                  {nextStatuses.length > 0 && (
                    <div className="flex gap-2 pt-4 border-t">
                      {nextStatuses.map((nextStatus) => (
                        <button
                          key={nextStatus}
                          onClick={() => handleStatusUpdate(order.id, nextStatus)}
                          disabled={updatingId === order.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium text-sm"
                        >
                          {updatingId === order.id ? (
                            <Loader2 size={16} className="inline animate-spin" />
                          ) : (
                            <span>
                              {nextStatus === 'confirmed' && 'Confirmar'}
                              {nextStatus === 'shipped' && 'Marcar Enviado'}
                              {nextStatus === 'delivered' && 'Marcar Entregue'}
                              {nextStatus === 'cancelled' && 'Cancelar'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
