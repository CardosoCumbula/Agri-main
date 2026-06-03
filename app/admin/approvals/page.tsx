'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, X, Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/components/Toast';
import {
  getPendingProducts,
  approveProduct,
  rejectProduct,
} from '@/lib/firestore/products';
import {
  getPendingListings,
  approveListing,
  rejectListing,
} from '@/lib/firestore/market';
import {
  notifyProductApproval,
  notifyProductRejection,
} from '@/lib/firestore/notifications';
import { Product, MarketListing } from '@/lib/types';

interface PendingItem {
  id: string;
  type: 'product' | 'listing';
  name: string;
  submitterName: string;
  province: string;
  price: number;
  image?: string;
  quantity?: number;
  unit?: string;
  createdAt: Date;
  rawData: Product | MarketListing;
}

export default function AdminApprovalsPage() {
  const { isAuthorized } = useAdminAuth();
  const { addToast } = useToast();
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      fetchPendingItems();
    }
  }, [isAuthorized]);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      const products = await getPendingProducts();
      const listings = await getPendingListings();

      const productItems = products.map((p: Product) => ({
        id: p.id,
        type: 'product' as const,
        name: p.name,
        submitterName: p.farmerName,
        province: p.province,
        price: p.price,
        image: p.imageUrl,
        quantity: p.quantity,
        unit: p.unit,
        createdAt: p.createdAt,
        rawData: p,
      }));

      const listingItems = listings.map((l: MarketListing) => ({
        id: l.id,
        type: 'listing' as const,
        name: l.productName,
        submitterName: l.buyerName,
        province: l.location,
        price: l.pricePerUnit,
        image: l.imageUrl,
        quantity: l.quantityNeeded,
        unit: l.unit,
        createdAt: l.postedAt,
        rawData: l,
      }));

      setItems([...productItems, ...listingItems].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast(`Erro ao buscar itens pendentes: ${msg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: PendingItem) => {
    try {
      setProcessingId(item.id);

      if (item.type === 'product') {
        const product = item.rawData as Product;
        await approveProduct(item.id);
        await notifyProductApproval(product.farmerId, product.name, product.id);
        addToast(`Produto "${item.name}" aprovado com sucesso!`, 'success');
      } else {
        await approveListing(item.id);
        addToast(`Pedido "${item.name}" aprovado com sucesso!`, 'success');
      }

      fetchPendingItems();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast(`Erro ao aprovar: ${msg}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (item: PendingItem) => {
    if (!rejectionReason.trim()) {
      addToast('Por favor, forneça um motivo para a rejeição', 'error');
      return;
    }

    try {
      setProcessingId(item.id);

      if (item.type === 'product') {
        const product = item.rawData as Product;
        await rejectProduct(item.id, rejectionReason);
        await notifyProductRejection(
          product.farmerId,
          product.name,
          rejectionReason,
          product.id
        );
        addToast(`Produto "${item.name}" rejeitado com sucesso!`, 'success');
      } else {
        await rejectListing(item.id, rejectionReason);
        addToast(`Pedido "${item.name}" rejeitado com sucesso!`, 'success');
      }

      setRejectingId(null);
      setRejectionReason('');
      fetchPendingItems();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast(`Erro ao rejeitar: ${msg}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAuthorized) {
    return <div className="text-center py-8 text-red-600">Acesso negado</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="text-yellow-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Aprovações Pendentes</h1>
              <p className="text-gray-600 mt-1">
                {items.length} item{items.length !== 1 ? 's' : ''} aguardando revisão
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="inline animate-spin text-green-600" size={32} />
              <p className="text-gray-600 mt-4">Carregando itens pendentes...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">✓ Nenhum item aguardando aprovação</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    {item.image && (
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.type === 'product' ? 'Produto' : 'Pedido de Compra'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Por: <span className="font-medium">{item.submitterName}</span> • Província:{' '}
                            <span className="font-medium">{item.province}</span>
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString('pt-MZ')}
                        </span>
                      </div>

                      {/* Details Row */}
                      <div className="flex gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Preço Unitário:</span>
                          <p className="font-medium text-gray-900">{item.price.toFixed(2)} MT</p>
                        </div>
                        {item.quantity && (
                          <div>
                            <span className="text-gray-500">
                              Quantidade:
                            </span>
                            <p className="font-medium text-gray-900">
                              {item.quantity} {item.unit}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 border-t pt-6">
                    <button
                      onClick={() => handleApprove(item)}
                      disabled={processingId === item.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
                    >
                      {processingId === item.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Check size={18} />
                      )}
                      Aprovar
                    </button>

                    {rejectingId === item.id ? (
                      <div className="flex-1 flex flex-col gap-2">
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Motivo da rejeição..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(item)}
                            disabled={processingId === item.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-medium text-sm"
                          >
                            {processingId === item.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <X size={16} />
                            )}
                            Confirmar Rejeição
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRejectingId(item.id)}
                        disabled={processingId === item.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:bg-gray-100 transition font-medium"
                      >
                        <X size={18} />
                        Rejeitar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
