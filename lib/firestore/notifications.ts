import { supabase } from '../supabase';
const TABLE = 'notifications';
export async function createNotification(userId, type, message, relatedId) {
  const { data, error } = await supabase.from(TABLE).insert({ user_id: userId, type, message, related_id: relatedId || null, read: false }).select('id').single();
  if (error) throw error;
  return data.id;
}
export async function getNotifications(userId) { const { data, error } = await supabase.from(TABLE).select('*').eq('user_id', userId).order('created_at', { ascending: false }); if (error) throw error; return (data || []).map(r => ({ id: r.id, userId: r.user_id, type: r.type, message: r.message, read: r.read, relatedId: r.related_id, createdAt: new Date(r.created_at) })); }
export async function getUnreadNotificationCount(userId) { const { count, error } = await supabase.from(TABLE).select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('read', false); if (error) throw error; return count || 0; }
export async function markNotificationAsRead(id) { await supabase.from(TABLE).update({ read: true }).eq('id', id); }
export async function markAllNotificationsAsRead(userId) { await supabase.from(TABLE).update({ read: true }).eq('user_id', userId).eq('read', false); }
export async function deleteNotification(id) { await supabase.from(TABLE).delete().eq('id', id); }
export function listenToNotifications(userId, callback) {
  getNotifications(userId).then(callback);
  const channel = supabase.channel('notif:' + userId).on('postgres_changes', { event: '*', schema: 'public', table: TABLE, filter: 'user_id=eq.' + userId }, () => { getNotifications(userId).then(callback); }).subscribe();
  return () => { supabase.removeChannel(channel); };
}
export async function notifyProductApproval(farmerId, productName, productId) { await createNotification(farmerId, 'product_approved', 'Seu produto "' + productName + '" foi aprovado.', productId); }
export async function notifyProductRejection(farmerId, productName, reason, productId) { await createNotification(farmerId, 'product_rejected', 'Seu produto "' + productName + '" foi rejeitado. Motivo: ' + reason, productId); }
export async function notifyNewOrder(farmerId, buyerName, productName, orderId) { await createNotification(farmerId, 'new_order', buyerName + ' fez um pedido para "' + productName + '".', orderId); }
export async function notifyOrderStatusUpdate(buyerId, status, productName, orderId) { await createNotification(buyerId, 'order_status_update', 'Seu pedido de "' + productName + '" foi atualizado para: ' + status + '.', orderId); }
export async function notifyNewMessage(userId, senderName, conversationId) { await createNotification(userId, 'new_message', senderName + ' enviou-lhe uma mensagem.', conversationId); }