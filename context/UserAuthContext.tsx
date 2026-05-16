'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'farmer' | 'buyer';
  avatar?: string;
}

interface UserAuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('agromoz_user');
      const token = localStorage.getItem('agromoz_token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error restoring session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email e palavra-passe são obrigatórios');
      }

      if (!email.includes('@')) {
        throw new Error('Email inválido');
      }

      // Demo authentication
      if (email === 'admin@agromoz.com' && password === 'admin123') {
        const userData: User = {
          id: 'user_admin_001',
          email,
          name: 'Administrador AgroMoz',
          role: 'admin',
        };
        
        localStorage.setItem('agromoz_user', JSON.stringify(userData));
        localStorage.setItem('agromoz_token', `token_${Date.now()}`);
        setUser(userData);
        return;
      }

      // Mock farmer/buyer registration
      if (password.length >= 8) {
        const userData: User = {
          id: `user_${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: 'farmer',
        };
        
        localStorage.setItem('agromoz_user', JSON.stringify(userData));
        localStorage.setItem('agromoz_token', `token_${Date.now()}`);
        setUser(userData);
        return;
      }

      throw new Error('Email ou palavra-passe inválidos');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('agromoz_user');
    localStorage.removeItem('agromoz_token');
    setUser(null);
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    setIsLoading(true);
    try {
      // Validation
      if (!email?.includes('@')) throw new Error('Email inválido');
      if (password?.length < 8) throw new Error('Palavra-passe deve ter mínimo 8 caracteres');
      if (name?.length < 3) throw new Error('Nome deve ter mínimo 3 caracteres');

      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        role: (role as 'admin' | 'farmer' | 'buyer') || 'farmer',
      };

      localStorage.setItem('agromoz_user', JSON.stringify(userData));
      localStorage.setItem('agromoz_token', `token_${Date.now()}`);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth(): UserAuthContextType {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  return context;
}
