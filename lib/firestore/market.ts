import { supabase } from '../supabase';
import { MarketListing, MarketListingStatus } from '../types';

const TABLE = 'market_listings';

export async function getListings(filters?: {
  province?: string;
  status?: MarketListingStatus;
}): Promise<MarketListing[]> {
  const status = filters?.status || 'approved';
  let q = supabase.from(TABLE).select('*').eq('status', status);
  if (filters?.province) q = q.eq('location', filters.province);
  const { data, error } = await q.order('posted_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapListing);
}

export async function getListingById(listingId: string): Promise<MarketListing | null> {
  const { data, error } = await supabase
    .from(TABLE).select('*').eq('id', listingId).single();
  if (error) return null;
  return mapListing(data);
}

export async function addListing(listing: Omit<MarketListing, 'id' | 'postedAt'>): Promise<string> {
  const { data, error } = await supabase.from(TABLE).insert({
    product_name: listing.productName,
    buyer_name: listing.buyerName,
    buyer_type: listing.buyerType,
    location: listing.location,
    price_per_unit: listing.pricePerUnit,
    unit: listing.unit,
    quantity_needed: listing.quantityNeeded,
    frequency: listing.frequency,
    image_url: listing.imageUrl,
    status: 'pending',
  }).select('id').single();
  if (error) throw error;
  return data.id;
}

export async function updateListing(listingId: string, updates: Partial<MarketListing>): Promise<void> {
  const { error } = await supabase.from(TABLE).update({
    ...(updates.productName && { product_name: updates.productName }),
    ...(updates.location && { location: updates.location }),
    ...(updates.pricePerUnit && { price_per_unit: updates.pricePerUnit }),
    ...(updates.status && { status: updates.status }),
    ...(updates.rejectionReason !== undefined && { rejection_reason: updates.rejectionReason }),
  }).eq('id', listingId);
  if (error) throw error;
}

export async function deleteListing(listingId: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', listingId);
  if (error) throw error;
}

export async function approveListing(listingId: string): Promise<void> {
  const { error } = await supabase.from(TABLE)
    .update({ status: 'approved', rejection_reason: null }).eq('id', listingId);
  if (error) throw error;
}

export async function rejectListing(listingId: string, rejectionReason: string): Promise<void> {
  const { error } = await supabase.from(TABLE)
    .update({ status: 'rejected', rejection_reason: rejectionReason }).eq('id', listingId);
  if (error) throw error;
}

export async function getPendingListings(): Promise<MarketListing[]> {
  const { data, error } = await supabase.from(TABLE)
    .select('*').eq('status', 'pending').order('posted_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapListing);
}

function mapListing(row: any): MarketListing {
  return {
    id: row.id,
    productName: row.product_name,
    buyerName: row.buyer_name,
    buyerType: row.buyer_type,
    location: row.location,
    pricePerUnit: row.price_per_unit,
    unit: row.unit,
    quantityNeeded: row.quantity_needed,
    frequency: row.frequency,
    imageUrl: row.image_url,
    status: row.status,
    rejectionReason: row.rejection_reason,
    postedAt: new Date(row.posted_at),
  };
}
