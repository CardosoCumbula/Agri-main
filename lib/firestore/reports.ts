import { supabase } from '../supabase';
const TABLE = 'reports';
export async function createReport(conversationId, reportedBy, reason) { const { data, error } = await supabase.from(TABLE).insert({ conversation_id: conversationId, reported_by: reportedBy, reason, status: 'open' }).select('id').single(); if (error) throw error; return data.id; }
export async function getReports() { const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false }); if (error) throw error; return data || []; }
export async function resolveReport(reportId, adminNotes) { await supabase.from(TABLE).update({ status: 'resolved', admin_notes: adminNotes }).eq('id', reportId); }