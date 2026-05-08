'use client';

import React from 'react';
import { motion } from 'motion/react';

const categories = [
  { id: 'all', name: 'Todos os Produtos' },
  { id: 'Cereais', name: 'Cereais' },
  { id: 'Legumes', name: 'Legumes' },
  { id: 'Frutas', name: 'Frutas' },
  { id: 'Oleaginosas', name: 'Oleaginosas' },
  { id: 'Outros', name: 'Outros Produtos' },
];

interface CategoryFilterProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 border ${
            selected === cat.id
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
