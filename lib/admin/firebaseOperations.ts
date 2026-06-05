import { supabase } from '../supabase';
export async function getAllProducts() { const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }); if (error) throw error; return data || []; }
export async function getAllListings() { const { data, error } = await supabase.from('market_listings').select('*').order('posted_at', { ascending: false }); if (error) throw error; return data || []; }
export async function approveProduct(id) { await supabase.from('products').update({ status: 'approved', rejection_reason: null }).eq('id', id); }
export async function rejectProduct(id, reason) { await supabase.from('products').update({ status: 'rejected', rejection_reason: reason }).eq('id', id); }
export async function approveListing(id) { await supabase.from('market_listings').update({ status: 'approved', rejection_reason: null }).eq('id', id); }
export async function rejectListing(id, reason) { await supabase.from('market_listings').update({ status: 'rejected', rejection_reason: reason }).eq('id', id); }