import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/firebase';

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  imageUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Product Operations
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...product,
      updatedAt: Timestamp.now(),
    });
    return { id, ...product };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'products', id));
    return id;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const q = query(collection(db, 'products'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Batch operations
export const deleteMultipleProducts = async (ids: string[]) => {
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      batch.delete(doc(db, 'products', id));
    });
    await batch.commit();
    return ids;
  } catch (error) {
    console.error('Error deleting multiple products:', error);
    throw error;
  }
};

// Analytics
export const getProductStats = async () => {
  try {
    const products = await getAllProducts();
    const categories = [...new Set(products.map((p) => p.category))];
    
    return {
      totalProducts: products.length,
      categories: categories.length,
      categoryBreakdown: categories.map((cat) => ({
        category: cat,
        count: products.filter((p) => p.category === cat).length,
      })),
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};
