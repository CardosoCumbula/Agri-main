'use client';

import React from 'react';
import { motion } from 'motion/react';

export function LoadingCard() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm h-full flex flex-col"
    >
      {/* Image skeleton */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-stone-200 to-stone-300" />

      <div className="p-5 flex flex-col flex-grow space-y-4">
        {/* Title skeleton */}
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-stone-200 rounded w-full" />
          <div className="h-3 bg-stone-200 rounded w-5/6" />
        </div>

        {/* Location skeleton */}
        <div className="h-8 bg-stone-100 rounded-lg flex-grow" />

        {/* Button skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="h-3 bg-stone-200 rounded w-1/4" />
          <div className="w-10 h-10 bg-stone-200 rounded-lg" />
        </div>
      </div>
    </motion.div>
  );
}

export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}
