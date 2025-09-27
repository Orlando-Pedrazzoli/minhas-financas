'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-white text-lg'>Carregando...</p>
      </div>
    </div>
  );
}
