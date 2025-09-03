'use client';

import { ArrowUpRight, ArrowDownRight, CreditCard, Wallet } from 'lucide-react';
import { formatters } from '@/lib/config';

export default function TransactionList({ transactions, loading }) {
  const getIcon = type => {
    switch (type) {
      case 'income':
      case 'salary':
        return <ArrowUpRight className='w-5 h-5' />;
      case 'credit':
        return <CreditCard className='w-5 h-5' />;
      default:
        return <ArrowDownRight className='w-5 h-5' />;
    }
  };

  const getColor = type => {
    switch (type) {
      case 'income':
      case 'salary':
        return 'text-green-600 bg-green-50';
      case 'credit':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  const getAmountColor = type => {
    switch (type) {
      case 'income':
      case 'salary':
        return 'text-green-600';
      case 'credit':
        return 'text-orange-600';
      default:
        return 'text-red-600';
    }
  };

  const getAmountPrefix = type => {
    return type === 'income' || type === 'salary' ? '+' : '-';
  };

  if (loading) {
    return (
      <div className='space-y-3'>
        {[1, 2, 3].map(i => (
          <div key={i} className='bg-white rounded-2xl p-4 animate-pulse'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-gray-200 rounded-full' />
              <div className='flex-1'>
                <div className='h-4 bg-gray-200 rounded w-32 mb-2' />
                <div className='h-3 bg-gray-200 rounded w-24' />
              </div>
              <div>
                <div className='h-5 bg-gray-200 rounded w-20 mb-1' />
                <div className='h-3 bg-gray-200 rounded w-16 ml-auto' />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className='bg-white rounded-2xl p-8 text-center'>
        <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Wallet className='w-8 h-8 text-purple-600' />
        </div>
        <p className='text-gray-800 font-semibold mb-2'>
          Nenhuma transação ainda
        </p>
        <p className='text-gray-500 text-sm'>
          Adicione sua primeira transação clicando no botão +
        </p>
      </div>
    );
  }

  // Agrupar transações por dia
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.time).toLocaleDateString('pt-PT');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <div className='space-y-4'>
      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
        <div key={date}>
          <p className='text-xs font-medium text-gray-500 mb-2 px-1'>
            {date === new Date().toLocaleDateString('pt-PT') ? 'Hoje' : date}
          </p>
          <div className='space-y-2'>
            {dayTransactions.map(transaction => (
              <div
                key={transaction.id}
                className='bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group'
              >
                <div className='flex items-center gap-4'>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getColor(
                      transaction.type
                    )} group-hover:scale-110 transition-transform`}
                  >
                    {getIcon(transaction.type)}
                  </div>

                  <div className='flex-1'>
                    <p className='font-semibold text-gray-800'>
                      {transaction.category}
                    </p>
                    {transaction.description && (
                      <p className='text-sm text-gray-500 mt-0.5'>
                        {transaction.description}
                      </p>
                    )}
                    <p className='text-xs text-gray-400 mt-1'>
                      {new Date(transaction.time).toLocaleTimeString('pt-PT', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className='text-right'>
                    <p
                      className={`text-lg font-bold ${getAmountColor(
                        transaction.type
                      )}`}
                    >
                      {getAmountPrefix(transaction.type)}{' '}
                      {formatters
                        .currency(transaction.amount)
                        .replace('€ ', '')}
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>
                      {transaction.typeLabel}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
