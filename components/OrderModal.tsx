'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createOrder } from '@/lib/firestore/orders';
import { notifyNewOrder } from '@/lib/firestore/notifications';
import { Product } from '@/lib/types';
import { useToast } from '@/components/Toast';

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: (orderId: string) => void;
}

const PAYMENT_METHODS = [
  { value: 'mpesa', label: 'M-Pesa', icon: '📱' },
  { value: 'emola', label: 'e-Mola', icon: '💳' },
  { value: 'bank_transfer', label: 'Transferência Bancária', icon: '🏦' },
  { value: 'cash_on_delivery', label: 'Pagamento na Entrega', icon: '💵' },
];

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola' | 'bank_transfer' | 'cash_on_delivery'>('mpesa');
  const [notes, setNotes] = useState('');

  const totalPrice = parseFloat(quantity || '0') * product.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== 'buyer') {
      addToast('Você deve ser um comprador para fazer encomendas', 'error');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      addToast('Por favor, insira uma quantidade válida', 'error');
      return;
    }

    if (!address.trim()) {
      addToast('Por favor, insira um endereço de entrega', 'error');
      return;
    }

    if (!province.trim()) {
      addToast('Por favor, selecione uma província', 'error');
      return;
    }

    try {
      setLoading(true);

      const orderId = await createOrder({
        productId: product.id,
        productName: product.name,
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        buyerId: user.uid,
        buyerName: user.name,
        quantity: parseFloat(quantity),
        unitPrice: product.price,
        totalPrice,
        unit: product.unit,
        status: 'pending',
        paymentMethod,
        paymentStatus: 'unpaid',
        deliveryAddress: address,
        province,
        notes: notes || undefined,
      });

      // Notify farmer
      await notifyNewOrder(
        product.farmerId,
        user.name,
        product.name,
        orderId
      );

      addToast('Encomenda criada com sucesso!', 'success');
      onOrderCreated?.(orderId);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating order:', error);
      addToast('Erro ao criar encomenda', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuantity('');
    setAddress('');
    setProvince('');
    setPaymentMethod('mpesa');
    setNotes('');
  };

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fazer Encomenda</h2>
            <p className="text-gray-600 mt-1">{product.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Info Summary */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Produto</p>
                <p className="font-medium text-gray-900">{product.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agricultor</p>
                <p className="font-medium text-gray-900">{product.farmerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Preço Unit.</p>
                <p className="font-medium text-green-600">{product.price.toFixed(2)} MT</p>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
              />
              <span className="text-gray-600 font-medium">{product.unit}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço de Entrega <span className="text-red-600">*</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Rua, número, bairro, referência..."
            />
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Província <span className="text-red-600">*</span>
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione a província...</option>
              <option value="Sofala">Sofala</option>
              <option value="Gaza">Gaza</option>
              <option value="Inhambane">Inhambane</option>
              <option value="Maputo">Maputo</option>
              <option value="Maputo Cidade">Maputo Cidade</option>
              <option value="Zambézia">Zambézia</option>
              <option value="Tete">Tete</option>
              <option value="Manica">Manica</option>
              <option value="Niassa">Niassa</option>
              <option value="Cabo Delgado">Cabo Delgado</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pagamento <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value as any)}
                  className={`p-3 border-2 rounded-lg transition text-left ${
                    paymentMethod === method.value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-lg">{method.icon}</p>
                  <p className="text-sm font-medium text-gray-900">{method.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-medium">ℹ️ Pagamento:</span> Você fará o pagamento conforme as instruções
              específicas do método selecionado. O administrador verificará e confirmará o pagamento.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex: Preferir entrega de manhã, sem pesticidas, etc."
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{totalPrice.toFixed(2)} MT</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  {totalPrice.toFixed(2)} MT
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !quantity || !address || !province}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Encomenda'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
