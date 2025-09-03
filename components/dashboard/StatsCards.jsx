'use client';

import {
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  CreditCard,
  PiggyBank,
} from 'lucide-react';
import { formatters } from '@/lib/config';

export default function StatsCards({
  creditLimit,
  creditUsed,
  creditAvailable,
  daysUntilDue,
  monthBalance,
}) {
  const cards = [
    {
      icon: CreditCard,
      label: 'Limite Disponível',
      value: formatters.currency(creditAvailable),
      subtext: `de ${formatters.currency(creditLimit)}`,
      color: 'purple',
      percentage: ((creditAvailable / creditLimit) * 100).toFixed(0),
    },
    {
      icon: Calendar,
      label: 'Vencimento',
      value: `${daysUntilDue} dias`,
      subtext: 'para pagar',
      color: daysUntilDue <= 3 ? 'red' : daysUntilDue <= 7 ? 'orange' : 'green',
      urgent: daysUntilDue <= 3,
    },
    {
      icon: monthBalance >= 0 ? TrendingUp : TrendingDown,
      label: 'Balanço Mensal',
      value: formatters.currency(Math.abs(monthBalance)),
      subtext: monthBalance >= 0 ? 'de economia' : 'de déficit',
      color: monthBalance >= 0 ? 'green' : 'red',
      trend: monthBalance >= 0 ? 'up' : 'down',
    },
  ];

  return (
    <div className='grid grid-cols-3 gap-3'>
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colors = {
          purple: 'bg-purple-50 text-purple-600 border-purple-200',
          green: 'bg-green-50 text-green-600 border-green-200',
          red: 'bg-red-50 text-red-600 border-red-200',
          orange: 'bg-orange-50 text-orange-600 border-orange-200',
        };

        const iconColors = {
          purple: 'bg-purple-100 text-purple-600',
          green: 'bg-green-100 text-green-600',
          red: 'bg-red-100 text-red-600',
          orange: 'bg-orange-100 text-orange-600',
        };

        return (
          <div
            key={index}
            className={`relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all group ${
              card.urgent ? 'animate-pulse' : ''
            }`}
          >
            {card.percentage && (
              <div className='absolute top-2 right-2 text-xs font-bold text-gray-400'>
                {card.percentage}%
              </div>
            )}

            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                iconColors[card.color]
              } group-hover:scale-110 transition-transform`}
            >
              <Icon className='w-5 h-5' />
            </div>

            <p className='text-xs text-gray-500 font-medium mb-1'>
              {card.label}
            </p>
            <p className='text-lg font-bold text-gray-800 leading-tight'>
              {card.trend && (
                <span
                  className={
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {card.trend === 'up' ? '+' : '-'}
                </span>
              )}
              {card.value}
            </p>
            <p className='text-xs text-gray-400 mt-1'>{card.subtext}</p>

            {card.urgent && (
              <div className='absolute inset-0 rounded-2xl border-2 border-red-300 pointer-events-none animate-pulse' />
            )}
          </div>
        );
      })}
    </div>
  );
}
