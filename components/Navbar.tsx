'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './FirebaseProvider';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const { user, profile, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'A Machamba' },
    { href: '/mercado', label: 'Mercado' },
    { href: '/clima', label: 'Clima' },
    { href: '/dicas', label: 'Dicas' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-stone-900">AgroMoz</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  isActive(link.href)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-stone-700 hover:text-emerald-700 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {profile?.role === 'farmer' && (
                  <Link href="/dashboard" className="text-sm font-bold text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg">
                    Minha Conta
                  </Link>
                )}
                <div className="flex items-center space-x-2 bg-stone-100 px-4 py-2 rounded-xl">
                  <span className="text-sm font-bold text-stone-800">{profile?.displayName?.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-sm font-bold text-stone-500 hover:text-red-600 px-2 flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <button 
                onClick={login}
                className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-md active:scale-95"
              >
                Entrar
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
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
                  className={`block px-3 py-3 rounded-lg font-medium transition-all ${
                    isActive(link.href)
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-stone-700 hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  {profile?.role === 'farmer' && (
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 rounded-lg font-medium text-emerald-600 hover:bg-emerald-50"
                    >
                      Minha Conta
                    </Link>
                  )}
                  <div className="pt-4 border-t border-stone-100">
                    <div className="flex items-center px-3 py-3">
                      <span className="text-stone-700 font-medium">{profile?.displayName}</span>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => {
                    login();
                    setIsOpen(false);
                  }}
                  className="w-full mt-4 bg-emerald-600 text-white px-4 py-3 rounded-xl font-semibold text-center hover:bg-emerald-700 transition-all"
                >
                  Entrar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
