import { supabase } from '../supabase';
const TABLE = 'orders';
export async function createOrder(order) {
  const { data, error } = await supabase.from(TABLE).insert({ product_id: order.productId, product_name: order.productName, farmer_id: order.farmerId, farmer_name: order.farmerName, buyer_id: order.buyerId, buyer_name: order.buyerName, quantity: order.quantity, unit_price: order.unitPrice, total_price: order.totalPrice, unit: order.unit, status: 'pending', payment_method: order.paymentMethod, payment_status: 'unpaid', delivery_address: order.deliveryAddress, province: order.province, notes: order.notes || null, status_history: [{ status: 'pending', timestamp: new Date().toISOString() }] }).select('id').single();
  if (error) throw error;
  return data.id;
}
export async function getOrderById(orderId) { const { data, error } = await supabase.from(TABLE).select('*').eq('id', orderId).single(); if (error) return null; return mapOrder(data); }
export async function getOrdersByBuyer(buyerId) { const { data, error } = await supabase.from(TABLE).select('*').eq('buyer_id', buyerId).order('created_at', { ascending: false }); if (error) throw error; return (data || []).map(mapOrder); }
export async function getOrdersByFarmer(farmerId) { const { data, error } = await supabase.from(TABLE).select('*').eq('farmer_id', farmerId).order('created_at', { ascending: false }); if (error) throw error; return (data || []).map(mapOrder); }
export async function getAllOrders() { const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false }); if (error) throw error; return (data || []).map(mapOrder); }
export async function updateOrderStatus(orderId, status) {
  const { data: existing } = await supabase.from(TABLE).select('status_history').eq('id', orderId).single();
  const history = existing?.status_history || [];
  history.push({ status, timestamp: new Date().toISOString() });
  const { error } = await supabase.from(TABLE).update({ status, status_history: history, updated_at: new Date().toISOString() }).eq('id', orderId);
  if (error) throw error;
}
export async function cancelOrder(orderId) { await updateOrderStatus(orderId, 'cancelled'); }
function mapOrder(row) { return { id: row.id, productId: row.product_id, productName: row.product_name, farmerId: row.farmer_id, farmerName: row.farmer_name, buyerId: row.buyer_id, buyerName: row.buyer_name, quantity: row.quantity, unitPrice: row.unit_price, totalPrice: row.total_price, unit: row.unit, status: row.status, paymentMethod: row.payment_method, paymentStatus: row.payment_status, deliveryAddress: row.delivery_address, province: row.province, notes: row.notes, statusHistory: row.status_history, createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) }; }