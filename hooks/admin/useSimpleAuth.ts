import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useSimpleAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const email = localStorage.getItem('admin_email');
    
    if (token && email) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const login = (email: string, password: string) => {
    if (email === 'admin@agromoz.com' && password === 'admin123') {
      localStorage.setItem('admin_token', 'token_' + Date.now());
      localStorage.setItem('admin_email', email);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setIsLoggedIn(false);
    router.push('/admin/login');
  };

  return { isLoggedIn, loading, login, logout };
};
