export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  imageUrl: string;
  type: 'sell' | 'buy';
  createdAt: string;
  updatedAt: string;
  userId?: string;
  contact?: string;
}

const STORAGE_KEY = 'agri_products';

// GET ALL PRODUCTS
export const getAllProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// GET BY TYPE (sell or buy)
export const getProductsByType = (type: 'sell' | 'buy'): Product[] => {
  return getAllProducts().filter(p => p.type === type);
};

// ADD PRODUCT
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const products = getAllProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return newProduct;
};

// UPDATE PRODUCT
export const updateProduct = async (id: string, product: Partial<Product>) => {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...product,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[index];
  }
  throw new Error('Product not found');
};

// DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  const products = getAllProducts();
  const filtered = products.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return id;
};

// GET STATS
export const getProductStats = async () => {
  const products = getAllProducts();
  const sellProducts = products.filter(p => p.type === 'sell');
  const buyProducts = products.filter(p => p.type === 'buy');
  const categories = [...new Set(products.map(p => p.category))];
  
  return {
    totalProducts: products.length,
    sellProducts: sellProducts.length,
    buyProducts: buyProducts.length,
    categories: categories.length,
    categoryBreakdown: categories.map(cat => ({
      category: cat,
      count: products.filter(p => p.category === cat).length,
    })),
  };
};
