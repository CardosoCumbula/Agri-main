// Auth Service - Improved authentication management
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'farmer' | 'buyer';
  avatar?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

class AuthService {
  private readonly STORAGE_KEY = 'agromoz_user';
  private readonly TOKEN_KEY = 'agromoz_token';
  private readonly DEMO_USER = {
    email: 'admin@agromoz.com',
    password: 'admin123',
  };

  async login(email: string, password: string): Promise<User> {
    try {
      // Demo authentication
      if (email === this.DEMO_USER.email && password === this.DEMO_USER.password) {
        const user: User = {
          id: 'demo_admin',
          email,
          name: 'Administrador',
          role: 'admin',
          createdAt: new Date(),
        };
        this.saveUser(user);
        this.saveToken('token_' + Date.now());
        return user;
      }

      throw new Error('Email ou palavra-passe inválidos');
    } catch (error: any) {
      throw new Error(error.message || 'Falha ao fazer login');
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  async register(email: string, password: string, name: string, role: string): Promise<User> {
    try {
      // Validation
      if (!this.isValidEmail(email)) {
        throw new Error('Email inválido');
      }
      if (password.length < 8) {
        throw new Error('Palavra-passe deve ter no mínimo 8 caracteres');
      }
      if (name.length < 3) {
        throw new Error('Nome deve ter no mínimo 3 caracteres');
      }

      // Mock registration
      const user: User = {
        id: Date.now().toString(),
        email,
        name,
        role: (role as 'admin' | 'farmer' | 'buyer') || 'farmer',
        createdAt: new Date(),
      };

      this.saveUser(user);
      this.saveToken('token_' + Date.now());
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      if (!this.isValidEmail(email)) {
        throw new Error('Email inválido');
      }
      // Mock password reset
      console.log(`Password reset email sent to ${email}`);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const authService = new AuthService();
