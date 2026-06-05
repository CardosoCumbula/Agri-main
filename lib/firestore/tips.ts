import { supabase } from '../supabase';
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
export async function deleteTip(tipId) { const { error } = await supabase.from('tips').delete().eq('id', tipId); if (error) throw error; }