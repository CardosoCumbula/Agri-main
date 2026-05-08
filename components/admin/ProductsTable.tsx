'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/admin/firebaseOperations';
import { Edit2, Trash2, Search } from 'lucide-react';

interface ProductsTableProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Image</th>
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">Price</th>
              <th className="px-4 py-3 text-left font-semibold">Location</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{product.title}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{product.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-blue-600/20 text-blue-400 rounded transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => product.id && onDelete(product.id)}
                        disabled={isDeleting}
                        className="p-2 hover:bg-red-600/20 text-red-400 rounded transition disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-400">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
};
