'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { getAllProducts, getProductsByType } from '@/lib/admin/localStorage';
import { Loader2, Filter } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load products from localStorage
    const loadProducts = () => {
      try {
        const allProducts = getAllProducts();
        // Filter by type (show 'sell' products on home page)
        const sellProducts = allProducts.filter(p => p.type === 'sell');
        
        if (selectedCategory !== 'all') {
          setProducts(sellProducts.filter(p => p.category === selectedCategory));
        } else {
          setProducts(sellProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
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
                className="w-full pl-4 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-stone-500 font-medium">Carregando produtos...</p>
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
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="w-10 h-10 text-stone-300" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Nenhum produto encontrado</h3>
                  <p className="text-stone-500">Tente ajustar os seus filtros ou termo de pesquisa.</p>
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
                onClick={() => window.location.href = '/dashboard'}
                className="bg-emerald-600 text-white px-10 py-5 rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95"
              >
                Começar a Vender
              </button>
            </div>
            <div className="hidden md:block w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl relative">
              <Image 
                src="https://picsum.photos/seed/farmer-success/600/600" 
                alt="Agricultor de Sucesso" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
