import { supabase } from '../supabase';
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
}