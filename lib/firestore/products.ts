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
  Query,
  QueryConstraint,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, ProductStatus, ProductCategory } from '../types';

const PRODUCTS_COLLECTION = 'products';

// Get all approved products with optional filters
export async function getProducts(filters?: {
  category?: ProductCategory;
  province?: string;
  farmerId?: string;
  status?: ProductStatus;
}): Promise<Product[]> {
  const constraints: QueryConstraint[] = [];

  // Only show approved products by default (for public pages)
  const status = filters?.status || 'approved';
  constraints.push(where('status', '==', status));

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters?.province) {
    constraints.push(where('province', '==', filters.province));
  }
  if (filters?.farmerId) {
    constraints.push(where('farmerId', '==', filters.farmerId));
  }

  const q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Product));
}

// Get a single product by ID
export async function getProductById(productId: string): Promise<Product | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
  } as Product;
}

// Add a new product (initially with 'pending' status)
export async function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Update a product
export async function updateProduct(
  productId: string,
  updates: Partial<Product>
): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(docRef, {
    ...updates,
    createdAt: updates.createdAt ? Timestamp.fromDate(updates.createdAt) : undefined,
  });
}

// Delete a product
export async function deleteProduct(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
}

// Approve a product
export async function approveProduct(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(docRef, {
    status: 'approved',
    rejectionReason: null,
  });
}

// Reject a product with a reason
export async function rejectProduct(
  productId: string,
  rejectionReason: string
): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(docRef, {
    status: 'rejected',
    rejectionReason,
  });
}

// Get all pending products (admin view)
export async function getPendingProducts(): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Product));
}

// Get products by farmer ID (for farmer dashboard)
export async function getProductsByFarmerId(farmerId: string): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('farmerId', '==', farmerId)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Product));
}
