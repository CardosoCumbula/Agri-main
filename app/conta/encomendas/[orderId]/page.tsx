'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getOrderById, updateOrderStatus } from '@/lib/firestore/orders';
import { getOrCreateConversation } from '@/lib/firestore/chat';
import { Order } from '@/lib/types';
import { Loader2, MessageCircle, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/components/Toast';

const ORDER_STATUSES = [
  { status: 'pending', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  { status: 'confirmed', label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
  { status: 'shipped', label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  { status: 'delivered', label: 'Entregue', color: 'bg-green-100 text-green-800' },
];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }
      fetchOrder();
    }
  }, [user, authLoading, router, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(orderId);
      if (!data) {
        addToast('Encomenda não encontrada', 'error');
        router.push('/conta/encomendas');
        return;
      }

      // Verify access
      if (data.buyerId !== user?.uid && data.farmerId !== user?.uid && user?.role !== 'admin') {
        addToast('Acesso negado', 'error');
        router.push('/');
        return;
      }

      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      addToast('Erro ao carregar encomenda', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = async () => {
    if (!user || !order) return;

    try {
      setContacting(true);
      const conversationId = await getOrCreateConversation(
        user.uid,
        order.farmerId,
        user.name,
        order.farmerName,
        order.productId
      );
      router.push(`/conta/mensagens?conversation=${conversationId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      addToast('Erro ao iniciar chat', 'error');
    } finally {
      setContacting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  if (!order) {
    return <div>Encomenda não encontrada</div>;
  }

  const statusIndex = ORDER_STATUSES.findIndex(s => s.status === order.status);
  const currentStatusInfo = ORDER_STATUSES[statusIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mb-4"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Encomenda #{order.id.substring(0, 8).toUpperCase()}
          </h1>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Status da Encomenda</h2>
          <div className="flex items-center justify-between">
            {ORDER_STATUSES.map((item, index) => (
              <div key={item.status} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                    index <= statusIndex
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-xs text-center font-medium text-gray-700">
                  {item.label}
                </p>
                {index < ORDER_STATUSES.length - 1 && (
                  <ChevronRight
                    className={`mt-2 ${
                      index < statusIndex ? 'text-green-600' : 'text-gray-300'
                    }`}
                    size={16}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Detalhes da Encomenda</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Produto</p>
                    <p className="font-medium text-gray-900">{order.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Agricultor</p>
                    <p className="font-medium text-gray-900">{order.farmerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantidade</p>
                    <p className="font-medium text-gray-900">
                      {order.quantity} {order.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preço Unitário</p>
                    <p className="font-medium text-gray-900">
                      {order.unitPrice.toFixed(2)} MT
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Método de Pagamento</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {order.paymentMethod === 'mpesa' && 'M-Pesa'}
                      {order.paymentMethod === 'emola' && 'e-Mola'}
                      {order.paymentMethod === 'bank_transfer' && 'Transferência Bancária'}
                      {order.paymentMethod === 'cash_on_delivery' && 'Pagamento na Entrega'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Localização de Entrega</p>
                    <p className="font-medium text-gray-900">{order.province}</p>
                  </div>
                </div>

                {order.notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Notas</p>
                    <p className="text-gray-900 mt-1">{order.notes}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Endereço de Entrega</p>
                  <p className="text-gray-900 mt-1">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Resumo</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{order.totalPrice.toFixed(2)} MT</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    {order.totalPrice.toFixed(2)} MT
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatusInfo.color}`}
                >
                  {currentStatusInfo.label}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Pagamento</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.paymentStatus === 'paid' ? 'Pago' : 'Não Pago'}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Data</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('pt-MZ')}
                </p>
              </div>
            </div>

            <button
              onClick={handleContactSeller}
              disabled={contacting}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
            >
              {contacting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <MessageCircle size={18} />
              )}
              {user?.role === 'buyer' ? 'Contactar Agricultor' : 'Contactar Comprador'}
            </button>
          </div>
        </div>

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Histórico</h2>
            <div className="space-y-3">
              {order.statusHistory.map((entry, index) => (
                <div key={index} className="flex items-start gap-4 pb-3 border-b last:border-b-0">
                  <div className="w-3 h-3 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {ORDER_STATUSES.find(s => s.status === entry.status)?.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(entry.timestamp).toLocaleString('pt-MZ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
