'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, firebaseUser, login } = useAuth();

  // If user is already logged in and is admin, redirect to dashboard
  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Navigation will happen after auth state updates
    } catch (err: any) {
      setError(err.message || 'Email ou palavra-passe inválidos');
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

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            <p className="font-semibold mb-2">Informação:</p>
            <p>Use suas credenciais de administrador Firebase para fazer login.</p>
            <p className="mt-2 text-xs">Apenas utilizadores com role "admin" podem acessar o painel.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
        </div>
      </div>
    </div>
  );
}
