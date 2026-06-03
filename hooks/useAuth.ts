'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUser, getUserById } from '@/lib/firestore/users';
import { User, UserRole } from '@/lib/types';

export interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole,
    province: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Custom hook for authentication
 * Manages Firebase Auth and Firestore user documents
 */
export function useAuth(): UseAuthReturn {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        setLoading(true);
        setError(null);

        if (fbUser) {
          setFirebaseUser(fbUser);
          // Fetch user document from Firestore
          const userData = await getUserById(fbUser.uid);
          setUser(userData);
        } else {
          setFirebaseUser(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Login with email and password
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to login';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Register with email and password
  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      phone: string,
      role: UserRole,
      province: string
    ): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Create Firebase Auth user
        const fbUserCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = fbUserCredential.user;

        // Create Firestore user document
        await createUser(fbUser.uid, {
          name,
          phone,
          role,
          province,
          email,
        });
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to register';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to logout';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    firebaseUser,
    loading,
    error,
    login,
    register,
    logout,
  };
}
