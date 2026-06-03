'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  BarChart3, 
  LogOut, 
  X,
  Clock,
} from 'lucide-react';
import { getPendingProducts } from '@/lib/firestore/products';
import { getPendingListings } from '@/lib/firestore/market';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const products = await getPendingProducts();
        const listings = await getPendingListings();
        setPendingCount(products.length + listings.length);
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };

    fetchPendingCount();
  }, []);

  const menuItems = [
    { icon: Clock, label: 'Aprovações', href: '/admin/approvals', badge: pendingCount > 0 ? pendingCount : null },
    { icon: Package, label: 'Produtos', href: '/admin/products' },
    { icon: BarChart3, label: 'Análise', href: '/admin/analytics' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">AgroMoz</h1>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">Painel Administrativo</p>
        </div>

        <nav className="p-6 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition relative ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-700 border-l-4 border-green-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-4">CMS para marketplace agrícola</p>
        </div>
      </aside>
    </>
  );
};
