'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(4250.0);
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([
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

  const handleAddTransaction = newTransaction => {
    setTransactions([newTransaction, ...transactions]);

    if (newTransaction.type === 'income' || newTransaction.type === 'salary') {
      setBalance(prev => prev + newTransaction.amount);
    } else {
      setBalance(prev => prev - newTransaction.amount);
    }

    setShowModal(false);
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
      <button
        onClick={() => setShowModal(true)}
        className='fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-2xl'
      >
        +
      </button>

      {/* Modal de Adicionar Transação */}
      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSave={handleAddTransaction}
        />
      )}
    </div>
  );
}

// Componente Modal
function TransactionModal({ onClose, onSave }) {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!type || !amount || !category) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      category,
      description: description || 'Sem descrição',
      date: new Date().toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onSave(newTransaction);
  };

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center'>
      <div className='absolute inset-0' onClick={onClose} />

      <div className='relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-gray-800'>Nova Transação</h2>
            <button
              onClick={onClose}
              className='w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-xl'
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6'>
          {/* Tipo */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Tipo de Transação *
            </label>
            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
                onClick={() => setType('debit')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === 'debit'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className='text-2xl mb-1'>💸</div>
                <div className='font-semibold'>Despesa</div>
              </button>

              <button
                type='button'
                onClick={() => setType('credit')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === 'credit'
                    ? 'bg-orange-50 border-orange-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className='text-2xl mb-1'>💳</div>
                <div className='font-semibold'>Cartão</div>
              </button>

              <button
                type='button'
                onClick={() => setType('income')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === 'income'
                    ? 'bg-green-50 border-green-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className='text-2xl mb-1'>💰</div>
                <div className='font-semibold'>Receita</div>
              </button>

              <button
                type='button'
                onClick={() => setType('salary')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === 'salary'
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className='text-2xl mb-1'>🏦</div>
                <div className='font-semibold'>Salário</div>
              </button>
            </div>
          </div>

          {/* Valor */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Valor *
            </label>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500'>
                €
              </span>
              <input
                type='number'
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder='0.00'
                step='0.01'
                min='0'
                className='w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg'
                required
              />
            </div>

            {/* Botões de valor rápido */}
            <div className='flex gap-2 mt-2'>
              {[5, 10, 20, 50, 100].map(val => (
                <button
                  key={val}
                  type='button'
                  onClick={() => setAmount(val.toString())}
                  className='flex-1 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors'
                >
                  {val}€
                </button>
              ))}
            </div>
          </div>

          {/* Categoria */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Categoria *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all'
              required
            >
              <option value=''>Selecione uma categoria...</option>
              {type === 'income' || type === 'salary' ? (
                <>
                  <option value='💰 Venda'>💰 Venda</option>
                  <option value='🏦 Salário'>🏦 Salário</option>
                  <option value='💼 Freelance'>💼 Freelance</option>
                  <option value='🎁 Presente'>🎁 Presente</option>
                  <option value='📈 Investimento'>📈 Investimento</option>
                </>
              ) : (
                <>
                  <option value='🍔 Alimentação'>🍔 Alimentação</option>
                  <option value='🚗 Transporte'>🚗 Transporte</option>
                  <option value='🏠 Casa'>🏠 Casa</option>
                  <option value='💊 Saúde'>💊 Saúde</option>
                  <option value='🎮 Lazer'>🎮 Lazer</option>
                  <option value='👕 Roupas'>👕 Roupas</option>
                  <option value='📚 Educação'>📚 Educação</option>
                  <option value='🛒 Mercado'>🛒 Mercado</option>
                  <option value='💡 Contas'>💡 Contas</option>
                  <option value='🎁 Outros'>🎁 Outros</option>
                </>
              )}
            </select>
          </div>

          {/* Descrição */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Descrição (opcional)
            </label>
            <input
              type='text'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Ex: Almoço no restaurante, Uber para o trabalho...'
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all'
              maxLength={100}
            />
          </div>

          {/* Botões */}
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={!type || !amount || !category}
              className='flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
