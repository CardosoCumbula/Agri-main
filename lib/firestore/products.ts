import { supabase } from '../supabase';
import { Product, ProductStatus, ProductCategory } from '../types';

const TABLE = 'products';

export async function getProducts(filters?: {
  category?: ProductCategory;
  province?: string;
  farmerId?: string;
  status?: ProductStatus;
}): Promise<Product[]> {
  const status = filters?.status || 'approved';
  let q = supabase.from(TABLE).select('*').eq('status', status);

  if (filters?.category) q = q.eq('category', filters.category);
  if (filters?.province) q = q.eq('province', filters.province);
  if (filters?.farmerId) q = q.eq('farmer_id', filters.farmerId);

  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function getProductById(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from(TABLE).select('*').eq('id', productId).single();
  if (error) return null;
  return mapProduct(data);
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
  const { data, error } = await supabase.from(TABLE).insert({
    name: product.name,
    category: product.category,
    price: product.price,
    unit: product.unit,
    quantity: product.quantity,
    farmer_id: product.farmerId,
    farmer_name: product.farmerName,
    province: product.province,
    image_url: product.imageUrl,
    status: 'pending',
  }).select('id').single();
  if (error) throw error;
  return data.id;
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  const { error } = await supabase.from(TABLE).update({
    ...(updates.name && { name: updates.name }),
    ...(updates.category && { category: updates.category }),
    ...(updates.price && { price: updates.price }),
    ...(updates.unit && { unit: updates.unit }),
    ...(updates.quantity && { quantity: updates.quantity }),
    ...(updates.imageUrl && { image_url: updates.imageUrl }),
    ...(updates.status && { status: updates.status }),
    ...(updates.rejectionReason !== undefined && { rejection_reason: updates.rejectionReason }),
  }).eq('id', productId);
  if (error) throw error;
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', productId);
  if (error) throw error;
}

export async function approveProduct(productId: string): Promise<void> {
  const { error } = await supabase.from(TABLE)
    .update({ status: 'approved', rejection_reason: null }).eq('id', productId);
  if (error) throw error;
}

export async function rejectProduct(productId: string, rejectionReason: string): Promise<void> {
  const { error } = await supabase.from(TABLE)
    .update({ status: 'rejected', rejection_reason: rejectionReason }).eq('id', productId);
  if (error) throw error;
}

export async function getPendingProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from(TABLE)
    .select('*').eq('status', 'pending').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function getProductsByFarmerId(farmerId: string): Promise<Product[]> {
  const { data, error } = await supabase.from(TABLE)
    .select('*').eq('farmer_id', farmerId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProduct);
}

function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    unit: row.unit,
    quantity: row.quantity,
    farmerId: row.farmer_id,
    farmerName: row.farmer_name,
    province: row.province,
    imageUrl: row.image_url,
    status: row.status,
    rejectionReason: row.rejection_reason,
    createdAt: new Date(row.created_at),
  };
}
