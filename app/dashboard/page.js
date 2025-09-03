'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [balance] = useState(4250.0);
  const [transactions] = useState([
    {
      id: 1,
      type: 'debit',
      amount: 12.5,
      category: '🍔 Alimentação',
      description: 'Almoço',
      date: 'Hoje, 12:30',
    },
    {
      id: 2,
      type: 'credit',
      amount: 45.0,
      category: '🛒 Mercado',
      description: 'Compras',
      date: 'Hoje, 10:00',
    },
    {
      id: 3,
      type: 'income',
      amount: 250.0,
      category: '💼 Freelance',
      description: 'Projeto',
      date: 'Ontem, 18:00',
    },
    {
      id: 4,
      type: 'salary',
      amount: 3500.0,
      category: '🏦 Salário',
      description: 'Mensal',
      date: '01/11/2024',
    },
  ]);

  useEffect(() => {
    // Verificar se está autenticado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <header className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>💰 Minhas Finanças</h1>
              <p className='text-purple-100'>Olá, {user.username}!</p>
            </div>
            <button
              onClick={handleLogout}
              className='bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors'
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        {/* Balance Card */}
        <div className='bg-white rounded-2xl shadow-xl p-6 mb-8'>
          <h2 className='text-gray-600 mb-2'>Saldo Disponível</h2>
          <p className='text-4xl font-bold text-gray-800'>
            € {balance.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-white rounded-xl shadow p-4'>
            <p className='text-gray-600 text-sm'>Gastos Hoje</p>
            <p className='text-2xl font-bold text-red-600'>€ 57,50</p>
          </div>
          <div className='bg-white rounded-xl shadow p-4'>
            <p className='text-gray-600 text-sm'>Receitas Mês</p>
            <p className='text-2xl font-bold text-green-600'>€ 3.750,00</p>
          </div>
          <div className='bg-white rounded-xl shadow p-4'>
            <p className='text-gray-600 text-sm'>Fatura Cartão</p>
            <p className='text-2xl font-bold text-orange-600'>€ 45,00</p>
          </div>
        </div>

        {/* Transactions */}
        <div className='bg-white rounded-2xl shadow-xl p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>
            Últimas Transações
          </h2>
          <div className='space-y-3'>
            {transactions.map(trans => (
              <div
                key={trans.id}
                className='flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg'
              >
                <div>
                  <p className='font-semibold text-gray-800'>
                    {trans.category}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {trans.description} • {trans.date}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    trans.type === 'income' || trans.type === 'salary'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {trans.type === 'income' || trans.type === 'salary'
                    ? '+'
                    : '-'}
                  € {trans.amount.toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className='fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-2xl'>
        +
      </button>
    </div>
  );
}
