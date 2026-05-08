'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Tag, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    unit: string;
    location: string;
    category: string;
    imageUrl?: string;
    farmerName: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Image 
          src={product.imageUrl || `https://picsum.photos/seed/${product.title}/400/400`} 
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-stone-900 line-clamp-1">{product.title}</h3>
          <p className="text-emerald-700 font-bold whitespace-nowrap">
            {product.price} MT
          </p>
        </div>
        
        <div className="flex items-center text-xs text-stone-500 mb-4 space-x-3">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-stone-400" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center">
            <span>{product.unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-stone-200 overflow-hidden relative">
              <Image 
                src={`https://picsum.photos/seed/${product.farmerName}/50/50`} 
                alt={product.farmerName} 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-medium text-stone-600">{product.farmerName}</span>
          </div>
          <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
