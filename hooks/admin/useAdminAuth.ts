'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');
      setIsAdmin(!!session?.user && adminEmails.includes(session.user.email || ''));
      setLoading(false);
    });
  }, []);
  return { isAdmin, loading };
}