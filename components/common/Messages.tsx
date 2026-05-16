'use client';

import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

interface MessageProps {
  type: MessageType;
  title: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function Message({ type, title, message, onClose, autoClose = true, duration = 5000 }: MessageProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoClose, duration, onClose]);

  const styles = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', title: 'text-emerald-900', text: 'text-emerald-700' },
    error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', title: 'text-red-900', text: 'text-red-700' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', title: 'text-amber-900', text: 'text-amber-700' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', title: 'text-blue-900', text: 'text-blue-700' },
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const style = styles[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`${style.bg} border ${style.border} rounded-lg p-4 flex items-start gap-3 mb-4`}
        >
          <div className={`${style.icon} flex-shrink-0 mt-0.5`}>{icons[type]}</div>
          <div className="flex-1">
            <h3 className={`font-bold text-sm ${style.title}`}>{title}</h3>
            <p className={`text-sm ${style.text} mt-1`}>{message}</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className={`${style.icon} hover:opacity-70 flex-shrink-0`}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Algo deu errado</h1>
          <p className="text-stone-600 mb-6">Pedimos desculpas, ocorreu um erro inesperado. Por favor, tente novamente.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all"
          >
            Recarregar Página
          </button>
          {process.env.NODE_ENV === 'development' && error && (
            <pre className="mt-4 p-3 bg-stone-100 rounded text-xs text-left overflow-auto text-red-600">
              {error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Icon className="w-16 h-16 text-stone-300 mb-4" />
      <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-600 text-center max-w-sm mb-6">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
