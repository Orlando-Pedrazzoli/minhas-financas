'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se tem token no localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Se tem token, vai para dashboard
      router.push('/dashboard');
    } else {
      // Se não tem token, vai para login
      router.push('/login');
    }
  }, [router]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-white text-lg font-medium'>Carregando...</p>
      </div>
    </div>
  );
}
