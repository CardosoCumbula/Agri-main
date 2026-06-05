'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Search, MapPin, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-100/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100 rounded-lg">
              Produtos da nossa terra
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-[1.2] mb-6">
              Compre produtos frescos diretamente de quem produz
            </h1>
            <p className="text-lg text-stone-600 mb-10 max-w-lg leading-relaxed">
              O AgroMoz ajuda agricultores de todo o país a venderem as suas colheitas de forma simples e segura.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="O que deseja comprar hoje?"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-stone-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button className="bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-emerald-800 transition-all shadow-lg active:scale-95">
                <span>Ver Produtos</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-stone-600">
              <div className="flex items-center p-3 bg-white rounded-xl border border-stone-100">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3" />
                <span>Agricultores Verificados</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-xl border border-stone-100">
                <div className="w-2 h-2 bg-orange-600 rounded-full mr-3" />
                <span>Preços Justos</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5]">
              <Image 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop/seed/mozambique-farm/800/1000" 
                alt="Agricultura em Moçambique" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 relative">
                    <Image 
                      src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop/seed/farmer/100/100" 
                      alt="Farmer" 
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="text-white font-bold">Sr. Mateus</p>
                    <p className="text-white/80 text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Chokwé, Gaza
                    </p>
                  </div>
                  <div className="ml-auto bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Destaque
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
