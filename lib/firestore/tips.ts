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
import { Tip, TipCategory } from '../types';

const TIPS_COLLECTION = 'tips';

// Get all tips with optional category filter
export async function getTips(category?: TipCategory): Promise<Tip[]> {
  const constraints: QueryConstraint[] = [];

  if (category) {
    constraints.push(where('category', '==', category));
  }

  const q = query(collection(db, TIPS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    publishedAt: doc.data().publishedAt?.toDate(),
  } as Tip));
}

// Get a single tip by ID
export async function getTipById(tipId: string): Promise<Tip | null> {
  const docRef = doc(db, TIPS_COLLECTION, tipId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    publishedAt: docSnap.data().publishedAt?.toDate(),
  } as Tip;
}

// Add a new tip
export async function addTip(tip: Omit<Tip, 'id' | 'publishedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, TIPS_COLLECTION), {
    ...tip,
    publishedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Update a tip
export async function updateTip(
  tipId: string,
  updates: Partial<Tip>
): Promise<void> {
  const docRef = doc(db, TIPS_COLLECTION, tipId);
  await updateDoc(docRef, {
    ...updates,
    publishedAt: updates.publishedAt ? Timestamp.fromDate(updates.publishedAt) : undefined,
  });
}

// Delete a tip
export async function deleteTip(tipId: string): Promise<void> {
  const docRef = doc(db, TIPS_COLLECTION, tipId);
  await deleteDoc(docRef);
}

// Get tips by category count (for dashboard stats)
export async function getTipsByCategoryCount(): Promise<Record<TipCategory, number>> {
  const categories: TipCategory[] = ['Pragas', 'Irrigação', 'Sementes', 'Boas Práticas'];
  const counts: Record<TipCategory, number> = {
    Pragas: 0,
    Irrigação: 0,
    Sementes: 0,
    'Boas Práticas': 0,
  };

  for (const category of categories) {
    const q = query(collection(db, TIPS_COLLECTION), where('category', '==', category));
    const snapshot = await getDocs(q);
    counts[category] = snapshot.size;
  }

  return counts;
}
