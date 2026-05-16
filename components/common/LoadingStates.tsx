'use client';

import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Loader2, PackageX } from 'lucide-react';

// Skeleton Card Loader
export function LoadingSkeleton({ count = 4, variant = 'card' }: { count?: number; variant?: 'card' | 'text' | 'list' }) {
  if (variant === 'text') {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="h-4 bg-stone-200 rounded-lg"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4" aria-busy="true">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center space-x-4 p-4 bg-stone-100 rounded-lg"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-12 h-12 bg-stone-300 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-stone-300 rounded w-3/4" />
              <div className="h-3 bg-stone-300 rounded w-1/2" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-2xl bg-white border border-stone-200 overflow-hidden"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="aspect-square bg-gradient-to-br from-stone-200 to-stone-300" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-stone-200 rounded-lg w-3/4" />
            <div className="h-3 bg-stone-200 rounded-lg" />
            <div className="h-3 bg-stone-200 rounded-lg w-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function LoadingSpinner({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12" aria-busy="true">
      <motion.div
        className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        aria-label="Carregando"
      />
      {message && <p className="mt-4 text-stone-600 font-medium">{message}</p>}
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center z-50 backdrop-blur-sm" aria-busy="true">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 shadow-2xl"
      >
        <motion.div
          className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          aria-label="Processando"
        />
        <p className="mt-4 text-stone-600 font-medium text-center whitespace-nowrap">Processando...</p>
      </motion.div>
    </div>
  );
}

// Empty State
export function EmptyState({
  title = 'Sem resultados',
  description = 'Nenhum item encontrado',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <PackageX className="w-16 h-16 text-stone-300 mb-4" aria-hidden="true" />
      <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 max-w-sm">{description}</p>
    </div>
  );
}

// Error State
export function ErrorState({
  title = 'Erro ao carregar',
  description = 'Ocorreu um erro. Por favor, tente novamente.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-red-50 rounded-lg border border-red-200">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" aria-hidden="true" />
      <h3 className="text-xl font-bold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-6 max-w-sm">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          aria-label="Tentar novamente"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
}
