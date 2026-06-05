import { supabase } from '../supabase';
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
function mapUser(row) { return { uid: row.id, name: row.name, phone: row.phone, role: row.role, province: row.province, email: row.email, deactivated: row.deactivated, createdAt: new Date(row.created_at) }; }