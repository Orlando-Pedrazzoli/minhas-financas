'use client';

import { CreditCard as CardIcon, AlertCircle } from 'lucide-react';
import { formatters } from '@/lib/config';

export default function CreditCard({ limit, used, dueDay, percentage }) {
  const available = limit - used;
  const daysUntilDue = (() => {
    const today = new Date();
    const currentDay = today.getDate();
    if (dueDay >= currentDay) {
      return dueDay - currentDay;
    }
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    return daysInMonth - currentDay + dueDay;
  })();

  const getStatusColor = () => {
    if (percentage >= 90) return 'from-red-500 to-red-600';
    if (percentage >= 70) return 'from-orange-500 to-orange-600';
    return 'from-purple-500 to-indigo-600';
  };

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className='relative'>
      {/* Card Design */}
      <div
        className={`bg-gradient-to-br ${getStatusColor()} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full' />
          <div className='absolute -left-10 -bottom-10 w-32 h-32 bg-white rounded-full' />
        </div>

        {/* Card Content */}
        <div className='relative z-10'>
          <div className='flex justify-between items-start mb-8'>
            <div>
              <p className='text-white/80 text-xs font-medium mb-1'>
                CARTÃO DE CRÉDITO
              </p>
              <p className='text-2xl font-bold'>VISA Gold</p>
            </div>
            <div className='bg-white/20 backdrop-blur rounded-xl p-2'>
              <CardIcon className='w-6 h-6' />
            </div>
          </div>

          {/* Card Number */}
          <div className='mb-6'>
            <p className='text-white/60 text-xs mb-1'>Número do Cartão</p>
            <p className='text-lg font-mono tracking-wider'>
              •••• •••• •••• 1234
            </p>
          </div>

          {/* Card Details */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-white/60 text-xs mb-1'>Limite</p>
              <p className='text-lg font-bold'>{formatters.currency(limit)}</p>
            </div>
            <div className='text-right'>
              <p className='text-white/60 text-xs mb-1'>Disponível</p>
              <p className='text-lg font-bold'>
                {formatters.currency(available)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Details */}
      <div className='bg-white rounded-2xl p-4 shadow-lg -mt-4 mx-3 relative z-20'>
        <div className='mb-3'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              Uso do Limite
            </span>
            <span className='text-sm font-bold text-gray-900'>
              {formatters.percentage(percentage)}
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
            <div
              className={`h-full ${getProgressColor()} rounded-full transition-all duration-500 relative`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            >
              <div className='absolute inset-0 bg-white/30 animate-pulse' />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center p-2 bg-gray-50 rounded-lg'>
            <p className='text-2xl font-bold text-gray-800'>{daysUntilDue}</p>
            <p className='text-xs text-gray-500'>dias p/ vencer</p>
          </div>
          <div className='text-center p-2 bg-gray-50 rounded-lg'>
            <p className='text-2xl font-bold text-gray-800'>{dueDay}</p>
            <p className='text-xs text-gray-500'>dia vencimento</p>
          </div>
        </div>

        {percentage >= 80 && (
          <div className='mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2'>
            <AlertCircle className='w-4 h-4 text-orange-600 mt-0.5' />
            <div>
              <p className='text-sm font-medium text-orange-800'>
                Atenção ao limite!
              </p>
              <p className='text-xs text-orange-600 mt-0.5'>
                Você já usou {percentage.toFixed(0)}% do seu limite disponível.
              </p>
            </div>
          </div>
        )}

        {daysUntilDue <= 3 && (
          <div className='mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2'>
            <AlertCircle className='w-4 h-4 text-red-600 mt-0.5' />
            <div>
              <p className='text-sm font-medium text-red-800'>
                Fatura próxima do vencimento!
              </p>
              <p className='text-xs text-red-600 mt-0.5'>
                Pague sua fatura até o dia {dueDay} para evitar juros.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
