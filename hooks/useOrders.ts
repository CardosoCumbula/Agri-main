'use client';

import { useState, useCallback } from 'react';
import { Order } from '@/lib/types';
import { createOrder, getOrdersByBuyer, getOrdersByFarmer, updateOrderStatus, updatePaymentStatus } from '@/lib/firestore/orders';
import { notifyNewOrder, notifyOrderStatusUpdate } from '@/lib/firestore/notifications';

export interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrdersByBuyer: (buyerId: string) => Promise<void>;
  fetchOrdersByFarmer: (farmerId: string) => Promise<void>;
  createNewOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Promise<string>;
  updateStatus: (orderId: string, status: string) => Promise<void>;
  updatePayment: (orderId: string, paymentStatus: 'unpaid' | 'paid' | 'refunded') => Promise<void>;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersByBuyer = useCallback(async (buyerId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrdersByBuyer(buyerId);
      setOrders(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrdersByFarmer = useCallback(async (farmerId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrdersByFarmer(farmerId);
      setOrders(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewOrder = useCallback(
    async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<string> => {
      try {
        setError(null);
        const orderId = await createOrder(order);
        
        // Notify farmer about new order
        await notifyNewOrder(order.farmerId, order.buyerName, order.productName, orderId);
        
        return orderId;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(msg);
        throw err;
      }
    },
    []
  );

  const updateStatus = useCallback(async (orderId: string, status: string) => {
    try {
      setError(null);
      // TODO: Fetch order to get buyer/farmer info for notification
      await updateOrderStatus(orderId, status as any);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(msg);
      throw err;
    }
  }, []);

  const updatePayment = useCallback(
    async (orderId: string, paymentStatus: 'unpaid' | 'paid' | 'refunded') => {
      try {
        setError(null);
        await updatePaymentStatus(orderId, paymentStatus);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(msg);
        throw err;
      }
    },
    []
  );

  return {
    orders,
    loading,
    error,
    fetchOrdersByBuyer,
    fetchOrdersByFarmer,
    createNewOrder,
    updateStatus,
    updatePayment,
  };
}
