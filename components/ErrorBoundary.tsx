'use client';

import React, { ReactNode, Component, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-stone-50 px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Algo deu errado</h1>
            <p className="text-stone-600 mb-6">
              {this.state.error?.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
            </p>
            <button
              onClick={this.reset}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              aria-label="Tentar novamente"
            >
              <RotateCcw className="w-4 h-4" />
              Tentar Novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
