const fs = require('fs');
const path = require('path');

const files = {
'lib/firestore/users.ts': `import { supabase } from '../supabase';
import { User, UserRole } from '../types';
const TABLE = 'users';
export async function getUserById(uid) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', uid).single();
  if (error) return null;
  return mapUser(data);
}
export async function createUser(uid, userData) {
  const { error } = await supabase.from(TABLE).insert({ id: uid, name: userData.name, phone: userData.phone, role: userData.role, province: userData.province, email: userData.email });
  if (error) throw error;
}
export async function updateUserProfile(uid, updates) {
  const { error } = await supabase.from(TABLE).update({ ...(updates.name && { name: updates.name }), ...(updates.phone && { phone: updates.phone }), ...(updates.province && { province: updates.province }) }).eq('id', uid);
  if (error) throw error;
}
export async function deactivateUser(uid) { const { error } = await supabase.from(TABLE).update({ deactivated: true }).eq('id', uid); if (error) throw error; }
export async function reactivateUser(uid) { const { error } = await supabase.from(TABLE).update({ deactivated: false }).eq('id', uid); if (error) throw error; }
export async function getAllUsers() { const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false }); if (error) throw error; return (data || []).map(mapUser); }
export async function getFarmers() { const { data, error } = await supabase.from(TABLE).select('*').eq('role', 'farmer'); if (error) throw error; return (data || []).map(mapUser); }
export async function getBuyers() { const { data, error } = await supabase.from(TABLE).select('*').eq('role', 'buyer'); if (error) throw error; return (data || []).map(mapUser); }
function mapUser(row) { return { uid: row.id, name: row.name, phone: row.phone, role: row.role, province: row.province, email: row.email, deactivated: row.deactivated, createdAt: new Date(row.created_at) }; }`,

'lib/firestore/tips.ts': `import { supabase } from '../supabase';
export async function getTips(category) {
  let q = supabase.from('tips').select('*');
  if (category) q = q.eq('category', category);
  const { data, error } = await q.order('published_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(r => ({ id: r.id, title: r.title, category: r.category, readTime: r.read_time, summary: r.summary, imageUrl: r.image_url, publishedAt: new Date(r.published_at) }));
}
export async function getTipById(tipId) {
  const { data, error } = await supabase.from('tips').select('*').eq('id', tipId).single();
  if (error) return null;
  return { id: data.id, title: data.title, category: data.category, readTime: data.read_time, summary: data.summary, imageUrl: data.image_url, publishedAt: new Date(data.published_at) };
}
export async function addTip(tip) {
  const { data, error } = await supabase.from('tips').insert({ title: tip.title, category: tip.category, read_time: tip.readTime, summary: tip.summary, image_url: tip.imageUrl }).select('id').single();
  if (error) throw error;
  return data.id;
}
export async function updateTip(tipId, updates) {
  const { error } = await supabase.from('tips').update({ ...(updates.title && { title: updates.title }), ...(updates.category && { category: updates.category }), ...(updates.summary && { summary: updates.summary }), ...(updates.imageUrl && { image_url: updates.imageUrl }) }).eq('id', tipId);
  if (error) throw error;
}
export async function deleteTip(tipId) { const { error } = await supabase.from('tips').delete().eq('id', tipId); if (error) throw error; }`,

'lib/firestore/orders.ts': `import { supabase } from '../supabase';
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
function mapOrder(row) { return { id: row.id, productId: row.product_id, productName: row.product_name, farmerId: row.farmer_id, farmerName: row.farmer_name, buyerId: row.buyer_id, buyerName: row.buyer_name, quantity: row.quantity, unitPrice: row.unit_price, totalPrice: row.total_price, unit: row.unit, status: row.status, paymentMethod: row.payment_method, paymentStatus: row.payment_status, deliveryAddress: row.delivery_address, province: row.province, notes: row.notes, statusHistory: row.status_history, createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) }; }`,

'lib/firestore/chat.ts': `import { supabase } from '../supabase';
export async function getOrCreateConversation(buyerId, farmerId, productId) {
  const { data: existing } = await supabase.from('conversations').select('id').contains('participant_ids', [buyerId, farmerId]).maybeSingle();
  if (existing) return existing.id;
  const { data, error } = await supabase.from('conversations').insert({ participant_ids: [buyerId, farmerId], product_id: productId || null, last_message: '', unread_count: {} }).select('id').single();
  if (error) throw error;
  return data.id;
}
export async function getConversations(uid) { const { data, error } = await supabase.from('conversations').select('*').contains('participant_ids', [uid]).order('last_message_at', { ascending: false }); if (error) throw error; return (data || []).map(r => ({ id: r.id, participantIds: r.participant_ids, participantNames: r.participant_names || {}, productId: r.product_id, lastMessage: r.last_message, lastMessageAt: new Date(r.last_message_at), unreadCount: r.unread_count || {}, createdAt: new Date(r.created_at) })); }
export async function getMessages(conversationId) { const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true }); if (error) throw error; return (data || []).map(r => ({ id: r.id, senderId: r.sender_id, senderName: r.sender_name, text: r.text, imageUrl: r.image_url, read: r.read, createdAt: new Date(r.created_at) })); }
export async function sendMessage(conversationId, senderId, senderName, text, imageUrl) {
  const { error: e1 } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: senderId, sender_name: senderName, text, image_url: imageUrl || null, read: false });
  if (e1) throw e1;
  const { error: e2 } = await supabase.from('conversations').update({ last_message: text, last_message_at: new Date().toISOString() }).eq('id', conversationId);
  if (e2) throw e2;
}
export async function markAsRead(conversationId, uid) { await supabase.from('messages').update({ read: true }).eq('conversation_id', conversationId).neq('sender_id', uid); }
export function listenToMessages(conversationId, callback) {
  getMessages(conversationId).then(callback);
  const channel = supabase.channel('messages:' + conversationId).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'conversation_id=eq.' + conversationId }, () => { getMessages(conversationId).then(callback); }).subscribe();
  return () => { supabase.removeChannel(channel); };
}`,

'lib/firestore/notifications.ts': `import { supabase } from '../supabase';
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
export async function notifyNewMessage(userId, senderName, conversationId) { await createNotification(userId, 'new_message', senderName + ' enviou-lhe uma mensagem.', conversationId); }`,

'lib/firestore/reports.ts': `import { supabase } from '../supabase';
const TABLE = 'reports';
export async function createReport(conversationId, reportedBy, reason) { const { data, error } = await supabase.from(TABLE).insert({ conversation_id: conversationId, reported_by: reportedBy, reason, status: 'open' }).select('id').single(); if (error) throw error; return data.id; }
export async function getReports() { const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false }); if (error) throw error; return data || []; }
export async function resolveReport(reportId, adminNotes) { await supabase.from(TABLE).update({ status: 'resolved', admin_notes: adminNotes }).eq('id', reportId); }`,

'lib/storage.ts': `import { supabase } from './supabase';
export async function uploadImage(file, storagePath) {
  const { data, error } = await supabase.storage.from('images').upload(storagePath, file, { upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
  return publicUrl;
}
export async function deleteImage(storagePath) {
  const { error } = await supabase.storage.from('images').remove([storagePath]);
  if (error) throw error;
}`,

'hooks/useAuth.ts': `'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { createUser, getUserById } from '@/lib/firestore/users';
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) { const u = await getUserById(session.user.id); setUser(u); }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) { const u = await getUserById(session.user.id); setUser(u); } else { setUser(null); }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); throw error; }
  }, []);
  const register = useCallback(async (email, password, name, phone, role, province) => {
    setLoading(true); setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setLoading(false); setError(error.message); throw error; }
    if (data.user) await createUser(data.user.id, { name, phone, role, province, email });
    setLoading(false);
  }, []);
  const logout = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null); setLoading(false);
  }, []);
  return { user, loading, error, login, register, logout };
}`,

'hooks/admin/useAdminAuth.ts': `'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');
      setIsAdmin(!!session?.user && adminEmails.includes(session.user.email || ''));
      setLoading(false);
    });
  }, []);
  return { isAdmin, loading };
}`,

'lib/admin/firebaseOperations.ts': `import { supabase } from '../supabase';
export async function getAllProducts() { const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }); if (error) throw error; return data || []; }
export async function getAllListings() { const { data, error } = await supabase.from('market_listings').select('*').order('posted_at', { ascending: false }); if (error) throw error; return data || []; }
export async function approveProduct(id) { await supabase.from('products').update({ status: 'approved', rejection_reason: null }).eq('id', id); }
export async function rejectProduct(id, reason) { await supabase.from('products').update({ status: 'rejected', rejection_reason: reason }).eq('id', id); }
export async function approveListing(id) { await supabase.from('market_listings').update({ status: 'approved', rejection_reason: null }).eq('id', id); }
export async function rejectListing(id, reason) { await supabase.from('market_listings').update({ status: 'rejected', rejection_reason: reason }).eq('id', id); }`,
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Written: ' + filePath);
}
console.log('All files written successfully!');
