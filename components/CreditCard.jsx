'use client';

import { CreditCard as CardIcon } from 'lucide-react';

export default function CreditCard({ limit, used, dueDate = 15 }) {
  const available = limit - used;
  const percentUsed = (used / limit) * 100;

  // Calcular dias até vencimento
  const today = new Date();
  const currentDay = today.getDate();
  const daysUntilDue =
    dueDate >= currentDay ? dueDate - currentDay : 30 - currentDay + dueDate;

  return (
    <div className='bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white shadow-lg'>
      <div className='flex justify-between items-center mb-3'>
        <span className='text-sm font-medium flex items-center gap-2'>
          <CardIcon className='w-4 h-4' />
          Visa Gold
        </span>
        <span className='text-xs bg-white/20 px-2 py-1 rounded-full'>
          Vence: {dueDate}/09
        </span>
      </div>

      <div className='bg-white/30 rounded-full h-2 overflow-hidden backdrop-blur'>
        <div
          className='bg-white h-full transition-all duration-500 ease-out'
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      <div className='flex justify-between mt-3 text-sm'>
        <span>Usado: € {used.toFixed(2).replace('.', ',')}</span>
        <span>Limite: € {limit.toFixed(2).replace('.', ',')}</span>
      </div>

      {percentUsed > 80 && (
        <div className='mt-3 bg-white/20 backdrop-blur rounded-lg p-2 text-xs text-center'>
          ⚠️ Atenção: {percentUsed.toFixed(0)}% do limite usado
        </div>
      )}

      {daysUntilDue <= 3 && (
        <div className='mt-3 bg-red-900/50 backdrop-blur rounded-lg p-2 text-xs text-center animate-pulse'>
          🚨 Fatura vence em {daysUntilDue} dias!
        </div>
      )}
    </div>
  );
}
