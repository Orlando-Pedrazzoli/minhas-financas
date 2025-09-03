'use client';

export default function BalanceCard({
  balance,
  todayExpenses,
  monthExpenses,
  creditUsed,
}) {
  return (
    <div className='bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl'>
      <p className='text-sm opacity-90 mb-2 flex items-center gap-2'>
        💰 Saldo Disponível
      </p>
      <h1 className='text-4xl font-bold mb-4'>
        € {balance.toFixed(2).replace('.', ',')}
      </h1>
      <div className='grid grid-cols-3 gap-4 pt-4 border-t border-white/20'>
        <div>
          <p className='text-xl font-semibold'>
            € {todayExpenses.toFixed(2).replace('.', ',')}
          </p>
          <p className='text-xs opacity-80'>Gastos Hoje</p>
        </div>
        <div>
          <p className='text-xl font-semibold'>
            € {monthExpenses.toFixed(2).replace('.', ',')}
          </p>
          <p className='text-xs opacity-80'>Gastos Mês</p>
        </div>
        <div>
          <p className='text-xl font-semibold'>
            € {creditUsed.toFixed(2).replace('.', ',')}
          </p>
          <p className='text-xs opacity-80'>Fatura Cartão</p>
        </div>
      </div>
    </div>
  );
}
