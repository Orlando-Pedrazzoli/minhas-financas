'use client';

import { Home, CreditCard, BarChart3, Settings, Wallet } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNav({ activeView, onViewChange }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Início',
      path: '/dashboard',
    },
    {
      id: 'cards',
      icon: CreditCard,
      label: 'Cartões',
      path: '/cards',
    },
    {
      id: 'wallet',
      icon: Wallet,
      label: 'Carteira',
      path: '/wallet',
    },
    {
      id: 'reports',
      icon: BarChart3,
      label: 'Relatórios',
      path: '/reports',
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Ajustes',
      path: '/settings',
    },
  ];

  const handleNavigation = item => {
    if (onViewChange) {
      onViewChange(item.id);
    }

    // Se a rota existir, navegar
    if (item.path && item.path !== pathname) {
      // Por enquanto, apenas simular navegação
      console.log('Navegando para:', item.path);
    }
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom'>
      <div className='flex justify-around items-center py-2'>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView
            ? activeView === item.id
            : pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative group ${
                isActive
                  ? 'text-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive && (
                <div className='absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-purple-600 rounded-full' />
              )}

              <div className={`relative ${isActive ? 'animate-scale-in' : ''}`}>
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {item.id === 'cards' && creditUsed > 0 && (
                  <span className='absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full' />
                )}
              </div>

              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-purple-600' : ''
                }`}
              >
                {item.label}
              </span>

              {/* Hover effect */}
              <div
                className={`absolute inset-0 bg-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
