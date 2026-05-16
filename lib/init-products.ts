// Helper to initialize sample products in localStorage
import { sampleProducts, productImages } from './mozambique-data';
import { Product } from './admin/localStorage';

export const initializeDefaultProducts = () => {
  if (typeof window === 'undefined') return;
  
  const STORAGE_KEY = 'agri_products';
  const existingData = localStorage.getItem(STORAGE_KEY);
  
  // Only initialize if no products exist
  if (!existingData || JSON.parse(existingData).length === 0) {
    const productsWithMetadata = sampleProducts.map((p) => ({
      id: Date.now().toString() + Math.random(),
      ...p,
      imageUrl: productImages[p.title] || '', // Use product-specific image if available
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productsWithMetadata));
  }
};
