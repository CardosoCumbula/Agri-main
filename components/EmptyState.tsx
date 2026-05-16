'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Search, Package, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 text-center"
    >
      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon || <Package className="w-10 h-10 text-stone-300" />}
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-all"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

export function SearchEmptyState() {
  return (
    <EmptyState
      icon={<Search className="w-10 h-10 text-stone-300" />}
      title="Nenhum produto encontrado"
      description="Tente ajustar os seus filtros ou termo de pesquisa."
    />
  );
}

export function NoProductsEmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={<Package className="w-10 h-10 text-stone-300" />}
      title="Sem produtos ainda"
      description="Comece a adicionar produtos ao seu inventário para começar a vender."
      action={onAdd ? { label: 'Adicionar Produto', onClick: onAdd } : undefined}
    />
  );
}

export function ErrorEmptyState({ 
  title = 'Algo correu mal',
  description = 'Ocorreu um erro ao carregar os dados. Tente novamente.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-10 h-10 text-red-400" />}
      title={title}
      description={description}
      action={onRetry ? { label: 'Tentar Novamente', onClick: onRetry } : undefined}
    />
  );
}
