'use client';

import { Bell, RefreshCw, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/lib/config';

export default function Header({ user, onRefresh, loading }) {
  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className='bg-gradient-to-r from-purple-600 to-indigo-600 pt-safe'>
      <div className='px-4 py-4'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <p className='text-white/80 text-sm'>{getGreeting()},</p>
            <h1 className='text-white text-2xl font-bold capitalize'>
              {user?.username || 'Usuário'}
            </h1>
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={onRefresh}
              disabled={loading}
              className='w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors disabled:opacity-50'
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
              />
            </button>

            <button className='w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors relative'>
              <Bell className='w-5 h-5' />
              <span className='absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-purple-600'></span>
            </button>

            <div className='relative'>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className='w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors'
              >
                <User className='w-5 h-5' />
              </button>

              {showMenu && (
                <>
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowMenu(false)}
                  />
                  <div className='absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl overflow-hidden z-50 animate-scale-in'>
                    <div className='p-4 border-b border-gray-100'>
                      <p className='font-semibold text-gray-800'>
                        {user?.username}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {config.app.name} v{config.app.version}
                      </p>
                    </div>

                    <div className='p-2'>
                      <button className='w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors'>
                        <Settings className='w-4 h-4' />
                        <span className='text-sm'>Configurações</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          logout();
                        }}
                        className='w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-colors'
                      >
                        <LogOut className='w-4 h-4' />
                        <span className='text-sm'>Sair</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='bg-white/10 backdrop-blur rounded-xl px-3 py-2'>
          <p className='text-white/90 text-xs'>
            Última atualização:{' '}
            {new Date().toLocaleTimeString('pt-PT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </header>
  );
}
