'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { productImages, categoryImages } from '@/lib/mozambique-data';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    location: string;
    category: string;
    imageUrl?: string;
    description?: string;
    contact?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const getMozambiqueImage = (title: string, category: string) => {
    // Priority: product-specific image > category image > default
    return product.imageUrl || 
           productImages[title] || 
           categoryImages[category] || 
           'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=400&fit=crop';
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group h-full flex flex-col focus-within:ring-2 focus-within:ring-emerald-500"
      role="article"
      aria-label={`${product.title} - ${product.price} MZN`}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        <Image 
          src={getMozambiqueImage(product.title, product.category)}
          alt={`${product.title} - Produto agrícola de ${product.location}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=400&fit=crop';
          }}
        />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            {product.category}
          </span>
          <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
            MZN {product.price.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="font-bold text-stone-900 line-clamp-2 text-base">{product.title}</h3>
        </div>
        
        {product.description && (
          <p className="text-xs text-stone-600 mb-3 line-clamp-2 flex-grow">{product.description}</p>
        )}
        
        <div className="flex items-center text-xs text-stone-500 mb-4 bg-stone-50 p-2 rounded-lg">
          <MapPin className="w-4 h-4 mr-1.5 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{product.location}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
          <div className="text-xs">
            <p className="text-stone-500">Vendedor Local</p>
            <p className="text-emerald-700 font-bold">AgroMoz</p>
          </div>
          <button 
            className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all active:scale-95 shadow-md hover:shadow-lg" 
            title="Adicionar ao carrinho" 
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
