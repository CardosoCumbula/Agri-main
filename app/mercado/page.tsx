'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Search, Plus, MapPin, DollarSign, Package } from 'lucide-react';
import Image from 'next/image';

interface BuyerListing {
  id: number;
  product: string;
  buyer: string;
  location: string;
  price: string;
  quantity: string;
  timestamp: string;
  image: string;
  type: 'buy';
}

interface SellerListing {
  id: number;
  product: string;
  seller: string;
  location: string;
  price: string;
  quantity: string;
  timestamp: string;
  image: string;
  type: 'sell';
}

type Listing = BuyerListing | SellerListing;

const mockBuyers: BuyerListing[] = [
  {
    id: 1,
    product: 'Tomate Fresco',
    buyer: 'Supermercados VIP',
    location: 'Maputo Cidade',
    price: 'Até MZN 900 / Caixa',
    quantity: 'Precisa: 100 Caixas/Semana',
    timestamp: 'Hoje',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcccf?w=400&h=400&fit=crop',
    type: 'buy',
  },
  {
    id: 2,
    product: 'Milho Branco (Grão)',
    buyer: 'Moinhos de Moçambique',
    location: 'Matola',
    price: 'MZN 1.200 / Saco',
    quantity: 'Precisa: 500 Sacos',
    timestamp: 'Ontem',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=400&fit=crop',
    type: 'buy',
  },
  {
    id: 3,
    product: 'Feijão Manteiga',
    buyer: 'Restaurante Zambeze',
    location: 'Maputo Cidade',
    price: 'MZN 3.500 / Saco',
    quantity: 'Precisa: 10 Sacos',
    timestamp: 'Há 2 dias',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    type: 'buy',
  },
  {
    id: 4,
    product: 'Cebola',
    buyer: 'Distribuidora Central',
    location: 'Boane',
    price: 'MZN 450 / Saco',
    quantity: 'Precisa: 200 Sacos/Mês',
    timestamp: 'Há 3 dias',
    image: 'https://images.unsplash.com/photo-1563621033406-be7bc20a26cb?w=400&h=400&fit=crop',
    type: 'buy',
  },
  {
    id: 5,
    product: 'Soja Premium',
    buyer: 'Fábrica de Óleos Mozambique',
    location: 'Quelimane',
    price: 'MZN 1.750 / Saco',
    quantity: 'Precisa: 300 Sacos',
    timestamp: 'Hoje',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=400&fit=crop',
    type: 'buy',
  },
  {
    id: 6,
    product: 'Arroz Branco',
    buyer: 'Distribuidora de Alimentos',
    location: 'Inhambane',
    price: 'MZN 950 / Saco',
    quantity: 'Precisa: 250 Sacos/Mês',
    timestamp: 'Ontem',
    image: 'https://images.unsplash.com/photo-1586985289688-cacf2b32b55f?w=400&h=400&fit=crop',
    type: 'buy',
  },
];

const mockSellers: SellerListing[] = [
  {
    id: 1,
    product: 'Alface Crispla',
    seller: 'Fazenda Verde',
    location: 'Maputo',
    price: 'MZN 28 / Unidade',
    quantity: 'Disponível: 500 un',
    timestamp: 'Hoje',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    type: 'sell',
  },
  {
    id: 2,
    product: 'Banana Prata',
    seller: 'Produtores de Zambezia',
    location: 'Zambezia',
    price: 'MZN 40 / kg',
    quantity: 'Disponível: 2.000 kg',
    timestamp: 'Ontem',
    image: 'https://images.unsplash.com/photo-1596195694269-f5033e338d1b?w=400&h=400&fit=crop',
    type: 'sell',
  },
  {
    id: 3,
    product: 'Mangas Alfonce',
    seller: 'Plantações de Inhambane',
    location: 'Inhambane',
    price: 'MZN 80 / kg',
    quantity: 'Disponível: 1.500 kg',
    timestamp: 'Hoje',
    image: 'https://images.unsplash.com/photo-1585075694002-53b92f63b340?w=400&h=400&fit=crop',
    type: 'sell',
  },
  {
    id: 4,
    product: 'Girassol Óleo',
    seller: 'Cooperativa de Gaza',
    location: 'Gaza',
    price: 'MZN 160 / Saco',
    quantity: 'Disponível: 100 Sacos',
    timestamp: 'Ontem',
    image: 'https://images.unsplash.com/photo-1600721394637-beee27c7b227?w=400&h=400&fit=crop',
    type: 'sell',
  },
  {
    id: 5,
    product: 'Cenoura Laranja',
    seller: 'Horta de Maputo',
    location: 'Maputo',
    price: 'MZN 35 / kg',
    quantity: 'Disponível: 800 kg',
    timestamp: 'Hoje',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop',
    type: 'sell',
  },
  {
    id: 6,
    product: 'Pimento Vermelho',
    seller: 'Fazenda de Manica',
    location: 'Manica',
    price: 'MZN 55 / kg',
    quantity: 'Disponível: 600 kg',
    timestamp: 'Hoje',
    image: 'https://images.unsplash.com/photo-1563621033406-be7bc20a26cb?w=400&h=400&fit=crop',
    type: 'sell',
  },
];

export default function Mercado() {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('buy');
  const [searchTerm, setSearchTerm] = useState('');

  const listings: Listing[] = activeTab === 'buy' ? mockBuyers : mockSellers;

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-24">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">
          Mercado Agrícola
        </h1>
        <p className="text-stone-600">
          {activeTab === 'buy' 
            ? 'Venda a sua colheita ou compre insumos para a machamba.'
            : 'Compre produtos frescos diretamente dos agricultores.'}
        </p>
      </div>

      {/* Tab Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'buy'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Vender Colheita
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'sell'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Comprar Insumos
          </button>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder={activeTab === 'buy' ? 'Procurar compradores por cultura...' : 'Procurar produtos...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-all active:scale-95 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            Anunciar o meu produto
          </button>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-stone-900 mb-6">
          {activeTab === 'buy' ? 'Compradores à procura:' : 'Vendedores disponíveis:'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 overflow-hidden group">
              {/* Image */}
              <div className="relative w-full h-48 bg-stone-100 overflow-hidden">
                <Image
                  src={listing.image}
                  alt={listing.product}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1488459716781-8d3fa3d33fbd?w=400&h=400&fit=crop';
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-bold text-stone-900 text-lg mb-2">
                  {activeTab === 'buy' ? `Procura: ${listing.product}` : listing.product}
                </h3>

                {/* Buyer/Seller Name */}
                <div className="flex items-center gap-2 text-stone-600 text-sm mb-3">
                  <span className="font-medium">
                    {listing.type === 'buy' ? (listing as BuyerListing).buyer : (listing as SellerListing).seller}
                  </span>
                  <span className="text-stone-400">{listing.timestamp}</span>
                </div>

                {/* Details Grid */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    {listing.price}
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Package className="w-4 h-4 text-emerald-600" />
                    {listing.quantity}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-all active:scale-95">
                  {activeTab === 'buy' ? 'Tenho este produto' : 'Encomendar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
