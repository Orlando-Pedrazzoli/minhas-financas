'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  RefreshCw,
  LogOut,
  Home,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    balance: 0,
    creditLimit: 5000,
    creditUsed: 0,
    creditDueDay: 15,
    todayExpenses: 0,
    monthExpenses: 0,
    monthIncome: 0,
    transactions: [],
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Verificar autenticação e carregar dados
  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Verificar se está autenticado
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token || !savedUser) {
        router.push('/login');
        return;
      }

      setUser(JSON.parse(savedUser));

      // Carregar dados
      await Promise.all([
        loadBalance(token),
        loadCreditCard(token),
        loadTransactions(token),
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async token => {
    try {
      const response = await fetch('/api/balance', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const balanceData = await response.json();
        setData(prev => ({ ...prev, ...balanceData }));
      }
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
    }
  };

  const loadCreditCard = async token => {
    try {
      const response = await fetch('/api/credit-card', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const creditData = await response.json();
        setData(prev => ({
          ...prev,
          creditLimit: creditData.limit,
          creditUsed: creditData.used,
          creditDueDay: creditData.dueDay,
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar cartão:', error);
    }
  };

  const loadTransactions = async token => {
    try {
      const response = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const transactions = await response.json();
        setData(prev => ({ ...prev, transactions }));
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  const handleAddTransaction = async transaction => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (response.ok) {
        toast.success('Transação adicionada!');
        setShowAddModal(false);
        checkAuthAndLoadData(); // Recarregar dados
      } else {
        toast.error('Erro ao adicionar transação');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao adicionar transação');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleRefresh = () => {
    setLoading(true);
    checkAuthAndLoadData();
    toast.success('Dados atualizados!');
  };

  // Loading
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Carregando dados...</p>
        </div>
      </div>
    );
  }

  const creditPercentage = (data.creditUsed / data.creditLimit) * 100;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <header className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>💰 Minhas Finanças</h1>
              <p className='text-purple-100'>Olá, {user?.username}!</p>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handleRefresh}
                className='w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors'
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                />
              </button>
              <button
                onClick={handleLogout}
                className='w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors'
              >
                <LogOut className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        {/* Balance Card */}
        <div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
          <h2 className='text-gray-600 mb-2'>Saldo Disponível</h2>
          <p className='text-4xl font-bold text-gray-800'>
            € {data.balance.toFixed(2).replace('.', ',')}
          </p>
          <div className='grid grid-cols-3 gap-4 mt-4 pt-4 border-t'>
            <div>
              <p className='text-sm text-gray-500'>Gastos Hoje</p>
              <p className='text-lg font-semibold'>
                € {data.todayExpenses.toFixed(2)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Gastos Mês</p>
              <p className='text-lg font-semibold'>
                € {data.monthExpenses.toFixed(2)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Receitas Mês</p>
              <p className='text-lg font-semibold'>
                € {data.monthIncome.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Credit Card */}
        <div className='bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-xl p-6 mb-6'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <p className='text-white/80 text-sm'>Cartão de Crédito</p>
              <p className='text-2xl font-bold'>VISA Gold</p>
            </div>
            <CreditCard className='w-8 h-8' />
          </div>
          <div className='space-y-2'>
            <div className='bg-white/20 rounded-full h-2'>
              <div
                className='bg-white h-2 rounded-full transition-all'
                style={{ width: `${Math.min(creditPercentage, 100)}%` }}
              />
            </div>
            <div className='flex justify-between text-sm'>
              <span>Usado: € {data.creditUsed.toFixed(2)}</span>
              <span>Limite: € {data.creditLimit.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className='bg-white rounded-2xl shadow-xl p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>
            Últimas Transações
          </h2>
          <div className='space-y-3'>
            {data.transactions.length === 0 ? (
              <p className='text-center text-gray-500 py-8'>
                Nenhuma transação ainda
              </p>
            ) : (
              data.transactions.slice(0, 5).map(trans => (
                <div
                  key={trans.id}
                  className='flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg'
                >
                  <div>
                    <p className='font-semibold text-gray-800'>
                      {trans.category}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {trans.description} • {trans.time}
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
              ))
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className='fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-2xl'
      >
        <Plus className='w-6 h-6' />
      </button>

      {/* Modal Simplificado */}
      {showAddModal && (
        <TransactionModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTransaction}
        />
      )}
    </div>
  );
}

// Componente Modal Simplificado
function TransactionModal({ onClose, onSave }) {
  const [type, setType] = useState('debit');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (!amount || !category) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onSave({
      type,
      amount: parseFloat(amount),
      category,
      description: description || 'Sem descrição',
    });
  };

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl w-full max-w-md p-6'>
        <h2 className='text-2xl font-bold mb-4'>Nova Transação</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Tipo</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className='w-full p-2 border rounded-lg'
            >
              <option value='debit'>Débito</option>
              <option value='credit'>Cartão</option>
              <option value='income'>Receita</option>
              <option value='salary'>Salário</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Valor</label>
            <input
              type='number'
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder='0.00'
              step='0.01'
              className='w-full p-2 border rounded-lg'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Categoria</label>
            <input
              type='text'
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder='Ex: 🍔 Alimentação'
              className='w-full p-2 border rounded-lg'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Descrição</label>
            <input
              type='text'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Opcional'
              className='w-full p-2 border rounded-lg'
            />
          </div>

          <div className='flex gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-2 bg-gray-200 rounded-lg'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='flex-1 py-2 bg-purple-600 text-white rounded-lg'
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
