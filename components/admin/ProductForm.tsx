'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/lib/admin/localStorage';

const productSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  location: z.string().min(1, 'Localização é obrigatória'),
  imageUrl: z.string().url('URL de imagem inválida'),
  type: z.enum(['sell', 'buy']),
  contact: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const CATEGORIES = ['Vegetais', 'Grãos', 'Frutas', 'Insumos'];

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          location: product.location,
          imageUrl: product.imageUrl,
          type: product.type,
          contact: product.contact,
        }
      : { type: 'sell' },
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        location: product.location,
        imageUrl: product.imageUrl,
        type: product.type,
        contact: product.contact,
      });
    }
  }, [product, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Título
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            placeholder="Título do produto"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Preço (MZN)
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Categoria
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
          >
            <option value="">Selecione uma categoria</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Tipo
          </label>
          <select
            {...register('type')}
            className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
          >
            <option value="sell">Vender</option>
            <option value="buy">Comprar</option>
          </select>
          {errors.type && (
            <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Localização
          </label>
          <input
            {...register('location')}
            type="text"
            className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            placeholder="Localização"
          />
          {errors.location && (
            <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Contato (Opcional)
          </label>
          <input
            {...register('contact')}
            type="text"
            className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            placeholder="Email ou telefone"
          />
          {errors.contact && (
            <p className="text-red-600 text-sm mt-1">{errors.contact.message}</p>
          )}
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          URL da Imagem
        </label>
        <input
          {...register('imageUrl')}
          type="url"
          className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <p className="text-red-600 text-sm mt-1">{errors.imageUrl.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Descrição
        </label>
        <textarea
          {...register('description')}
          rows={6}
          className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
          placeholder="Descrição do produto"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 transition"
        >
          {isLoading ? 'Salvando...' : 'Salvar Produto'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
