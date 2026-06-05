import { supabase } from './supabase';
export async function uploadImage(file, storagePath) {
  const { data, error } = await supabase.storage.from('images').upload(storagePath, file, { upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
  return publicUrl;
}
export async function deleteImage(storagePath) {
  const { error } = await supabase.storage.from('images').remove([storagePath]);
  if (error) throw error;
}