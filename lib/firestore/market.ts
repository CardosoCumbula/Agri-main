import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { MarketListing, MarketListingStatus } from '../types';

const MARKET_COLLECTION = 'market_listings';

// Get all approved market listings with optional filters
export async function getListings(filters?: {
  province?: string;
  status?: MarketListingStatus;
}): Promise<MarketListing[]> {
  const constraints: QueryConstraint[] = [];

  // Only show approved listings by default
  const status = filters?.status || 'approved';
  constraints.push(where('status', '==', status));

  if (filters?.province) {
    constraints.push(where('location', '==', filters.province));
  }

  const q = query(collection(db, MARKET_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    postedAt: doc.data().postedAt?.toDate(),
  } as MarketListing));
}

// Get a single market listing by ID
export async function getListingById(listingId: string): Promise<MarketListing | null> {
  const docRef = doc(db, MARKET_COLLECTION, listingId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    postedAt: docSnap.data().postedAt?.toDate(),
  } as MarketListing;
}

// Add a new market listing (initially with 'pending' status)
export async function addListing(listing: Omit<MarketListing, 'id' | 'postedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, MARKET_COLLECTION), {
    ...listing,
    postedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Update a market listing
export async function updateListing(
  listingId: string,
  updates: Partial<MarketListing>
): Promise<void> {
  const docRef = doc(db, MARKET_COLLECTION, listingId);
  await updateDoc(docRef, {
    ...updates,
    postedAt: updates.postedAt ? Timestamp.fromDate(updates.postedAt) : undefined,
  });
}

// Delete a market listing
export async function deleteListing(listingId: string): Promise<void> {
  const docRef = doc(db, MARKET_COLLECTION, listingId);
  await deleteDoc(docRef);
}

// Approve a market listing
export async function approveListing(listingId: string): Promise<void> {
  const docRef = doc(db, MARKET_COLLECTION, listingId);
  await updateDoc(docRef, {
    status: 'approved',
    rejectionReason: null,
  });
}

// Reject a market listing with a reason
export async function rejectListing(
  listingId: string,
  rejectionReason: string
): Promise<void> {
  const docRef = doc(db, MARKET_COLLECTION, listingId);
  await updateDoc(docRef, {
    status: 'rejected',
    rejectionReason,
  });
}

// Get all pending market listings (admin view)
export async function getPendingListings(): Promise<MarketListing[]> {
  const q = query(
    collection(db, MARKET_COLLECTION),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    postedAt: doc.data().postedAt?.toDate(),
  } as MarketListing));
}
