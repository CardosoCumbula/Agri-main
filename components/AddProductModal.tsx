'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2, Upload, MapPin, Tag, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from './FirebaseProvider';

const productSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  description: z.string().min(10, 'Descrição muito curta'),
  category: z.enum(['Cereais', 'Legumes', 'Frutas', 'Oleaginosas', 'Outros']),
  price: z.number().min(1, 'Preço deve ser maior que 0'),
  unit: z.enum(['kg', 'saca', 'tonelada', 'unidade']),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  location: z.string().min(3, 'Localização necessária'),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: 'Cereais',
      unit: 'kg',
      quantity: 1,
      price: 0,
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...data,
        farmerId: user.uid,
        farmerName: profile?.displayName || 'Agricultor',
        status: 'available',
        createdAt: serverTimestamp(),
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div>
                <h2 className="text-3xl font-serif font-bold text-stone-900">O que vai vender hoje?</h2>
                <p className="text-stone-600 mt-1">Preencha os dados do seu produto abaixo.</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-stone-200 rounded-xl transition-colors">
                <X className="w-8 h-8 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3 col-span-full">
                  <label className="block text-sm font-bold text-stone-800">Nome do Produto</label>
                  <input 
                    {...register('title')}
                    placeholder="Exemplo: Milho Branco de Chokwé"
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                  />
                  {errors.title && <p className="text-xs text-red-600 font-bold">{errors.title.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-stone-800">Tipo</label>
                  <select 
                    {...register('category')}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                  >
                    <option value="Cereais">Cereais</option>
                    <option value="Legumes">Legumes</option>
                    <option value="Frutas">Frutas</option>
                    <option value="Oleaginosas">Oleaginosas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-stone-800">Localização</label>
                  <input 
                    {...register('location')}
                    placeholder="Ex: Chokwé, Gaza"
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-stone-800">Preço (MT)</label>
                  <input 
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-stone-800">Unidade</label>
                  <select 
                    {...register('unit')}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                  >
                    <option value="kg">Quilograma (kg)</option>
                    <option value="saca">Saca</option>
                    <option value="tonelada">Tonelada</option>
                    <option value="unidade">Unidade</option>
                  </select>
                </div>

                <div className="space-y-3 col-span-full">
                  <label className="block text-sm font-bold text-stone-800">Descrição</label>
                  <textarea 
                    {...register('description')}
                    rows={4}
                    placeholder="Fale um pouco sobre o seu produto..."
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-5 border border-stone-300 rounded-xl font-bold text-stone-700 hover:bg-stone-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-5 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>Publicar Agora</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
