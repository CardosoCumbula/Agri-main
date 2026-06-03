'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';
import { User } from '@/lib/types';

/**
 * Hook to protect admin routes
 * Redirects unauthenticated or non-admin users to /admin/login
 */
export function useAdminAuth() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    // If on login page, don't redirect
    if (pathname === '/admin/login') {
      setIsAuthorized(true);
      return;
    }

    // Check if user is logged in and is an admin
    const isAdmin = user && firebaseUser && user.role === 'admin';

    if (isAdmin) {
      setIsAuthorized(true);
    } else {
      // Redirect to login
      router.push('/admin/login');
    }
  }, [user, firebaseUser, loading, pathname, router]);

  return {
    user,
    firebaseUser,
    loading,
    isAuthorized,
    isAdmin: user?.role === 'admin',
  };
}

/**
 * Wrapper component to protect admin pages
 */
export function AdminProtection({ children }: { children: React.ReactNode }) {
  const { isAuthorized, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router will handle redirection
  }

  return <>{children}</>;
}
