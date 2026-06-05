'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { getProducts } from '@/lib/firestore/products';
import { Loader2, Filter, ArrowRight } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingCard } from '@/components/LoadingCard';
import { SearchEmptyState, NoProductsEmptyState } from '@/components/EmptyState';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch approved products from Firestore
        const approvedProducts = await getProducts({
          status: 'approved',
        });
        
        if (selectedCategory !== 'all') {
          setProducts(
            approvedProducts.filter(p => p.category === selectedCategory)
          );
        } else {
          setProducts(approvedProducts);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setError('Falha ao carregar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <main className="min-h-screen pb-20">
        <Navbar />
        <Hero />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex-1">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Produtos da Nossa Terra</h2>
              <p className="text-stone-500">Frescos, locais e prontos para si.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 md:w-64">
                <input 
                  type="text" 
                  placeholder="O que procura?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Pesquisar produtos"
                  className="w-full pl-4 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <SearchEmptyState />
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer / CTA for Farmers */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <div className="bg-stone-900 rounded-[2rem] overflow-hidden relative">
            <div className="px-8 py-16 md:p-20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                  É agricultor? <br />
                  <span className="text-emerald-500">Venda os seus produtos</span>
                </h2>
                <p className="text-stone-400 text-lg mb-10">
                  Crie a sua conta e comece a vender para todo o país de forma simples.
                </p>
                <button 
                  onClick={() => window.location.href = '/admin/login'}
                  className="bg-emerald-600 text-white px-10 py-5 rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95 flex items-center space-x-2 mx-auto md:mx-0"
                  aria-label="Ir para administração"
                >
                  <span>Começar a Vender</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="hidden md:block w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl relative">
                <Image 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop/seed/farmer-success/600/600" 
                  alt="Agricultor de Sucesso em Moçambique" 
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}
