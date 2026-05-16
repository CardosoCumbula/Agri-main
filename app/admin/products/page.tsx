'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { useToast } from '@/components/Toast';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  Product,
} from '@/lib/admin/localStorage';
import { Menu, Plus, Loader2, LogOut, Trash2, Edit2, AlertCircle, Package } from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = () => {
    try {
      setError(null);
      const data = getAllProducts();
      setProducts(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      addToast(`Erro ao buscar produtos: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data: any) => {
    setIsSaving(true);
    try {
      await addProduct(data);
      fetchProducts();
      setIsFormOpen(false);
      setEditingProduct(null);
      addToast('Produto adicionado com sucesso! ✓', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Falha ao adicionar produto';
      addToast(`Erro: ${errorMessage}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProduct = async (data: any) => {
    if (!editingProduct?.id) return;
    setIsSaving(true);
    try {
      await updateProduct(editingProduct.id, data);
      fetchProducts();
      setIsFormOpen(false);
      setEditingProduct(null);
      addToast('Produto atualizado com sucesso! ✓', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Falha ao atualizar produto';
      addToast(`Erro: ${errorMessage}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      fetchProducts();
      setDeleteConfirmId(null);
      addToast('Produto deletado com sucesso! ✓', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Falha ao deletar produto';
      addToast(`Erro ao deletar: ${errorMessage}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    addToast('Desconectado com sucesso', 'info');
    router.push('/admin/login');
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="bg-white border-b border-gray-200 p-4 lg:p-6 flex items-center justify-between sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
            >
              <Plus size={20} />
              Novo Produto
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-red-900">Erro ao carregar produtos</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}

          {isFormOpen && (
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <ProductForm
                product={editingProduct || undefined}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                onCancel={handleCloseForm}
                isLoading={isSaving}
              />
            </div>
          )}

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <input
                type="text"
                placeholder="Procurar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Pesquisar produtos por título ou categoria"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium">Nenhum produto encontrado</p>
                <p className="text-sm mt-1">Clique em "Novo Produto" para começar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Título</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoria</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <React.Fragment key={product.id}>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{product.price} MZN</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{product.category}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              product.type === 'sell' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {product.type === 'sell' ? 'Vender' : 'Comprar'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-800 transition p-1 rounded hover:bg-blue-50"
                                title="Editar produto"
                                aria-label={`Editar ${product.title}`}
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => confirmDelete(product.id)}
                                disabled={isDeleting}
                                className="text-red-600 hover:text-red-800 transition p-1 rounded hover:bg-red-50 disabled:opacity-50"
                                title="Deletar produto"
                                aria-label={`Deletar ${product.title}`}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Delete Confirmation Modal */}
                        {deleteConfirmId === product.id && (
                          <tr className="bg-red-50">
                            <td colSpan={5} className="px-6 py-4">
                              <div className="flex items-center justify-between bg-red-100 border border-red-300 rounded-lg p-4">
                                <div>
                                  <p className="font-medium text-red-900">Confirmar exclusão</p>
                                  <p className="text-sm text-red-700 mt-1">Tem certeza que deseja deletar "{product.title}"? Esta ação não pode ser desfeita.</p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                                  >
                                    {isDeleting ? 'Deletando...' : 'Deletar'}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
