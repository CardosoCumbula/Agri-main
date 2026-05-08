'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@agromoz.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simple auth check
      if (email === 'admin@agromoz.com' && password === 'admin123') {
        localStorage.setItem('admin_token', 'token_' + Date.now());
        localStorage.setItem('admin_email', email);
        router.push('/admin/products');
      } else {
        setError('Email ou palavra-passe inválidos');
      }
    } catch (err: any) {
      setError(err.message || 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-600">AgroMoz</h1>
            <p className="text-gray-600 text-sm">Painel Administrativo</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                placeholder="admin@agromoz.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            <p className="font-semibold mb-2">Credenciais de Demonstração:</p>
            <p>Email: admin@agromoz.com</p>
            <p>Palavra-passe: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
