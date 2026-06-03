'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ShoppingCart, Check, X } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  getPendingListings,
  getListings,
  approveListing,
  rejectListing,
} from '@/lib/firestore/market';
import {
  notifyProductApproval,
  notifyProductRejection,
} from '@/lib/firestore/notifications';
import { MarketListing } from '@/lib/types';
import { useToast } from '@/components/Toast';

type TabType = 'pending' | 'approved' | 'rejected';

export default function AdminMarketPage() {
  const { isAuthorized } = useAdminAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      fetchListings();
    }
  }, [isAuthorized, activeTab]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      let data: MarketListing[];

      if (activeTab === 'pending') {
        data = await getPendingListings();
      } else {
        data = await getListings({
          status: activeTab as any,
        });
      }

      setListings(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast(`Erro ao buscar anúncios: ${msg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listing: MarketListing) => {
    try {
      setProcessingId(listing.id);
      await approveListing(listing.id);
      // TODO: Create notification for buyer
      addToast(`Anúncio "${listing.productName}" aprovado com sucesso!`, 'success');
      fetchListings();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast(`Erro ao aprovar: ${msg}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (listing: MarketListing) => {
    if (!rejectionReason.trim()) {
      addToast('Por favor, forneça um motivo para a rejeição', 'error');
      return;
    }

    try {
      setProcessingId(listing.id);
      await rejectListing(listing.id, rejectionReason);
      // TODO: Notify buyer about rejection
      addToast(`Anúncio "${listing.productName}" rejeitado com sucesso!`, 'success');
      setRejectingId(null);
      setRejectionReason('');
      fetchListings();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast(`Erro ao rejeitar: ${msg}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="flex h-screen bg-gray-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded"
            >
              <ShoppingCart size={24} className="text-white" />
            </button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ShoppingCart size={32} className="text-green-500" />
              Gerenciamento do Mercado
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-gray-700">
            <button
              onClick={() => {
                setActiveTab('pending');
                setListings([]);
              }}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'pending'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Pendentes {activeTab === 'pending' && `(${listings.length})`}
            </button>
            <button
              onClick={() => {
                setActiveTab('approved');
                setListings([]);
              }}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'approved'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Aprovados {activeTab === 'approved' && `(${listings.length})`}
            </button>
            <button
              onClick={() => {
                setActiveTab('rejected');
                setListings([]);
              }}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'rejected'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Rejeitados {activeTab === 'rejected' && `(${listings.length})`}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-green-500" size={40} />
            </div>
          )}

          {/* Listings Grid */}
          {!loading && listings.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                Nenhum anúncio {activeTab === 'pending' ? 'pendente' : activeTab}
              </p>
            </div>
          )}

          {!loading && listings.length > 0 && (
            <div className="grid gap-4">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition"
                >
                  <div className="flex gap-4 p-4">
                    {/* Listing Image */}
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700">
                      {listing.imageUrl ? (
                        <img
                          src={listing.imageUrl}
                          alt={listing.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <ShoppingCart size={32} />
                        </div>
                      )}
                    </div>

                    {/* Listing Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {listing.productName}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          Comprador: <span className="text-blue-400">{listing.buyerName}</span>
                        </p>
                        <div className="flex gap-4 text-sm text-gray-300 mb-2">
                          <span>Tipo: {listing.buyerType}</span>
                          <span>Localização: {listing.location}</span>
                          <span>Frequência: {listing.frequency}</span>
                        </div>
                        <div className="flex gap-4">
                          <p className="text-lg font-bold text-green-400">
                            {listing.pricePerUnit} MZN / {listing.unit}
                          </p>
                          <p className="text-sm text-gray-300">
                            Quantidade: {listing.quantityNeeded} {listing.unit}
                          </p>
                        </div>
                      </div>

                      {/* Rejection Reason (if applicable) */}
                      {listing.rejectionReason && (
                        <div className="mt-3 p-2 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-300 text-sm">
                          <p className="font-semibold">Motivo da Rejeição:</p>
                          <p>{listing.rejectionReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {activeTab === 'pending' && (
                      <div className="flex flex-col gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(listing)}
                          disabled={processingId === listing.id}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                        >
                          {processingId === listing.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Check size={18} />
                          )}
                          Aprovar
                        </button>

                        {rejectingId === listing.id ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Motivo da rejeição..."
                              className="px-3 py-2 bg-gray-700 text-white rounded text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button
                              onClick={() => handleReject(listing)}
                              disabled={processingId === listing.id}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition disabled:opacity-50"
                            >
                              {processingId === listing.id ? 'Rejeitando...' : 'Confirmar Rejeição'}
                            </button>
                            <button
                              onClick={() => setRejectingId(null)}
                              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRejectingId(listing.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition"
                          >
                            <X size={18} />
                            Rejeitar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
