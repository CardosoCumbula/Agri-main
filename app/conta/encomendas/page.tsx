'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getOrdersByBuyer } from '@/lib/firestore/orders';
import { Order } from '@/lib/types';
import { Loader2, Package, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }

      if (user.role !== 'buyer') {
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
        const data = await getOrdersByBuyer(user.uid);
        setOrders(data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
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

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      unpaid: 'Não Pago',
      paid: 'Pago',
      refunded: 'Reembolsado',
    };
    return labels[status] || status;
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Encomendas</h1>
          <p className="text-gray-600 mt-2">
            {orders.length} encomenda{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg mb-4">
              Você ainda não fez nenhuma encomenda
            </p>
            <button
              onClick={() => router.push('/')}
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Explorar Produtos
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const statusInfo = getStatusLabel(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition p-6 cursor-pointer"
                  onClick={() => router.push(`/conta/encomendas/${order.id}`)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{order.productName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Agricultor: <span className="font-medium">{order.farmerName}</span>
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span>
                          <span className="text-gray-600">Quantidade:</span>{' '}
                          <span className="font-medium">{order.quantity} {order.unit}</span>
                        </span>
                        <span>
                          <span className="text-gray-600">Total:</span>{' '}
                          <span className="font-medium text-green-600">
                            {order.totalPrice.toFixed(2)} MT
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('pt-MZ')}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
