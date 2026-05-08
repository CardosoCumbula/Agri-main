'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Clock } from 'lucide-react';
import Image from 'next/image';

const categories = ['Todas', 'Pragas', 'Irrigação', 'Sementes'];

const articles = [
  {
    id: 1,
    title: 'Como combater a Lagarta do Funil do Milho',
    category: 'Pragas e Doenças',
    readTime: '5 min de leitura',
    description: 'Aprenda métodos naturais e químicos recomendados pelos serviços de extensão rural para proteger a sua plantação de milho.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcccf?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Preparação da terra para a época chuvosa',
    category: 'Boas Práticas',
    readTime: '3 min',
    description: 'Veja como fazer a lavoura de conservação para reter mais água no solo e evitar a erosão.',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Sistema de rega gota-a-gota caseiro',
    category: 'Irrigação',
    readTime: '8 min de leitura',
    description: 'Passo-a-passo para montar um sistema de irrigação eficiente usando garrafas PET e materiais de baixo custo.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Rotação de culturas: Milho e Feijão',
    category: 'Boas Práticas',
    readTime: '4 min de leitura',
    description: 'Descubra como a rotação entre cereais e leguminosas pode melhorar a fertilidade do seu solo naturalmente.',
    image: 'https://images.unsplash.com/photo-1488459716781-8d3fa3d33fbd?w=600&h=400&fit=crop',
  },
  {
    id: 5,
    title: 'Escolha de sementes de qualidade',
    category: 'Sementes',
    readTime: '6 min de leitura',
    description: 'Critérios para selecionar as melhores sementes para seu clima e tipo de solo.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
  },
  {
    id: 6,
    title: 'Prevenção de pragas sem químicos',
    category: 'Pragas',
    readTime: '7 min de leitura',
    description: 'Métodos naturais e ecológicos para manter sua plantação livre de pragas.',
    image: 'https://images.unsplash.com/photo-1585518419759-d87fa40b2e7e?w=600&h=400&fit=crop',
  },
];

export default function Dicas() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredArticles =
    selectedCategory === 'Todas'
      ? articles
      : articles.filter((article) => article.category.includes(selectedCategory));

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-24">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">
          Extensão Rural
        </h1>
        <p className="text-stone-600">
          Dicas e boas práticas para melhorar a sua produção.
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-stone-100 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1488459716781-8d3fa3d33fbd?w=600&h=400&fit=crop';
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category and Read Time */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-stone-500">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-stone-900 text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-stone-600 text-sm line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 text-lg">
              Nenhum artigo encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
