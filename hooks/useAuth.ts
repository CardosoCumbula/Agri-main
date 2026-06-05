'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { createUser, getUserById } from '@/lib/firestore/users';
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) { const u = await getUserById(session.user.id); setUser(u); }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) { const u = await getUserById(session.user.id); setUser(u); } else { setUser(null); }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); throw error; }
  }, []);
  const register = useCallback(async (email, password, name, phone, role, province) => {
    setLoading(true); setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setLoading(false); setError(error.message); throw error; }
    if (data.user) await createUser(data.user.id, { name, phone, role, province, email });
    setLoading(false);
  }, []);
  const logout = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null); setLoading(false);
  }, []);
  return { user, loading, error, login, register, logout };
}