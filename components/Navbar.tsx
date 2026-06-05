'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem('admin_token'));
  }, []);

  const navLinks = [
    { href: '/', label: 'A Machamba' },
    { href: '/mercado', label: 'Mercado' },
    { href: '/clima', label: 'Clima' },
    { href: '/dicas', label: 'Dicas' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setIsLoggedIn(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm" role="navigation" aria-label="Navegacao principal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" aria-label="AgroMoz Home">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌾</span>
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-stone-900">AgroMoz</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? 'px-4 py-2 rounded-lg font-bold text-sm text-emerald-700 bg-emerald-50' : 'px-4 py-2 rounded-lg font-bold text-sm text-stone-700 hover:text-emerald-700 hover:bg-stone-50'}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {mounted && isLoggedIn ? (
              <>
                <Link
                  href="/admin/products"
                  className="text-sm font-bold text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-all"
                >
                  Painel Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold text-stone-600 hover:text-red-600 px-3 py-2 rounded-lg flex items-center gap-1 transition-all hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Administracao
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-expanded={isOpen}
              aria-label="Menu de navegacao"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={isActive(link.href) ? 'block px-3 py-3 rounded-lg font-medium text-emerald-700 bg-emerald-50' : 'block px-3 py-3 rounded-lg font-medium text-stone-700 hover:text-emerald-700 hover:bg-stone-50'}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-stone-100">
                {mounted && isLoggedIn ? (
                  <>
                    <Link
                      href="/admin/products"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 rounded-lg font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      Painel Admin
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-lg font-medium bg-emerald-700 text-white hover:bg-emerald-800 text-center"
                  >
                    Administracao
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}