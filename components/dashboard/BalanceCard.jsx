'use client';

import { Eye, EyeOff, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useState } from 'react';
import { formatters } from '@/lib/config';

export default function BalanceCard({
  balance,
  todayExpenses,
  monthExpenses,
  monthIncome,
}) {
  const [showBalance, setShowBalance] = useState(true);
  const monthBalance = monthIncome - monthExpenses;
  const savingsRate = monthIncome > 0 ? (monthBalance / monthIncome) * 100 : 0;

  return (
    <div className='bg-white rounded-3xl shadow-xl overflow-hidden'>
      <div className='bg-gradient-to-r from-purple-600 to-indigo-600 p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center'>
              <Activity className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='text-white/90 text-sm font-medium'>
                Saldo Disponível
              </p>
              <p className='text-white/70 text-xs'>Conta Principal</p>
            </div>
          </div>

          <button
            onClick={() => setShowBalance(!showBalance)}
            className='w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors'
          >
            {showBalance ? (
              <Eye className='w-5 h-5' />
            ) : (
              <EyeOff className='w-5 h-5' />
            )}
          </button>
        </div>

        <div className='mb-6'>
          <h2 className='text-4xl font-bold text-white'>
            {showBalance ? formatters.currency(balance) : '€ ••••••'}
          </h2>
          {monthBalance !== 0 && (
            <div className='flex items-center gap-2 mt-2'>
              {monthBalance > 0 ? (
                <TrendingUp className='w-4 h-4 text-green-300' />
              ) : (
                <TrendingDown className='w-4 h-4 text-red-300' />
              )}
              <span
                className={`text-sm ${
                  monthBalance > 0 ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {monthBalance > 0 ? '+' : ''}
                {formatters.currency(monthBalance)} este mês
              </span>
            </div>
          )}
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div className='bg-white/10 backdrop-blur rounded-xl p-3'>
            <p className='text-white/70 text-xs mb-1'>Hoje</p>
            <p className='text-white font-semibold'>
              {showBalance ? formatters.currency(todayExpenses) : '••••'}
            </p>
          </div>

          <div className='bg-white/10 backdrop-blur rounded-xl p-3'>
            <p className='text-white/70 text-xs mb-1'>Mês</p>
            <p className='text-white font-semibold'>
              {showBalance ? formatters.currency(monthExpenses) : '••••'}
            </p>
          </div>

          <div className='bg-white/10 backdrop-blur rounded-xl p-3'>
            <p className='text-white/70 text-xs mb-1'>Receitas</p>
            <p className='text-white font-semibold'>
              {showBalance ? formatters.currency(monthIncome) : '••••'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar Section */}
      {savingsRate > 0 && (
        <div className='px-6 py-4 bg-gray-50'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs font-medium text-gray-600'>
              Taxa de Poupança
            </span>
            <span className='text-xs font-semibold text-purple-600'>
              {formatters.percentage(savingsRate)}
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500'
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
