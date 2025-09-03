'use client';

export default function TransactionList({ transactions }) {
  const getAmountColor = type => {
    switch (type) {
      case 'income':
      case 'salary':
        return 'text-green-600';
      case 'credit':
        return 'text-orange-600';
      case 'debit':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAmountPrefix = type => {
    return type === 'income' || type === 'salary' ? '+' : '-';
  };

  return (
    <div className='space-y-3'>
      {transactions.length === 0 ? (
        <div className='text-center py-8 text-white/70'>
          <p className='text-lg mb-2'>Nenhuma transação ainda</p>
          <p className='text-sm'>Clique no + para adicionar</p>
        </div>
      ) : (
        transactions.map(transaction => (
          <div
            key={transaction.id}
            className='bg-white/95 backdrop-blur rounded-xl p-4 flex justify-between items-center shadow-md hover:shadow-lg transition-shadow'
          >
            <div className='flex-1'>
              <p className='font-semibold text-gray-800'>
                {transaction.category}
                {transaction.description && (
                  <span className='text-gray-600 font-normal'>
                    {' '}
                    - {transaction.description}
                  </span>
                )}
              </p>
              <p className='text-xs text-gray-500 mt-1'>{transaction.time}</p>
            </div>
            <div className='text-right'>
              <p
                className={`text-xl font-bold ${getAmountColor(
                  transaction.type
                )}`}
              >
                {getAmountPrefix(transaction.type)} €{' '}
                {transaction.amount.toFixed(2).replace('.', ',')}
              </p>
              <p className='text-xs text-gray-400 mt-1'>
                {transaction.typeLabel}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
