'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser && authService.isAuthenticated()) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const user = await authService.login(email, password);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      setIsLoading(true);
      const user = await authService.register(email, password, name, role);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await authService.resetPassword(email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user && authService.isAuthenticated(),
    isLoading,
    login,
    logout,
    register,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route wrapper
export function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { isLoggedIn, user, isLoading } = useAuth();
  const router = require('next/navigation').useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/admin/login');
    }
    if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/');
    }
  }, [isLoading, isLoggedIn, requiredRole, user?.role, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!isLoggedIn || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
