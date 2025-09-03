'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  CreditCard,
  Home as HomeIcon,
  BarChart3,
  Settings,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [balance, setBalance] = useState(4250.0);
  const [creditUsed, setCreditUsed] = useState(0);
  const [creditLimit, setCreditLimit] = useState(5000);
  const [transactions, setTransactions] = useState([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar saldo
      const balanceRes = await fetch('/api/balance');
      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        if (balanceData.balance !== undefined) {
          setBalance(balanceData.balance);
        }
      }

      // Carregar cartão
      const cardRes = await fetch('/api/credit-card');
      if (cardRes.ok) {
        const cardData = await cardRes.json();
        if (cardData.used !== undefined) setCreditUsed(cardData.used);
        if (cardData.limit !== undefined) setCreditLimit(cardData.limit);
      }

      // Carregar transações
      const transRes = await fetch('/api/transactions');
      if (transRes.ok) {
        const transData = await transRes.json();
        if (Array.isArray(transData)) {
          setTransactions(transData);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Usar dados de exemplo se a API falhar
      setTransactions([
        {
          id: 1,
          type: 'debit',
          amount: 5.3,
          category: '🍔 Alimentação',
          description: 'Padaria',
          time: 'Hoje, 14:30',
          typeLabel: 'Débito',
        },
        {
          id: 2,
          type: 'credit',
          amount: 67.5,
          category: '🍕 Alimentação',
          description: 'Restaurante',
          time: 'Hoje, 12:15',
          typeLabel: 'Cartão',
        },
      ]);
    }
  };

  const handleQuickAdd = async () => {
    if (!selectedType || !amount) {
      toast.error('Selecione tipo e valor!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          amount: parseFloat(amount),
          category,
          description,
        }),
      });

      if (response.ok) {
        toast.success('Lançado com sucesso!');
        setShowQuickAdd(false);
        resetForm();
        loadData(); // Recarregar dados
      } else {
        // Se a API não existir ainda, simular sucesso
        toast.success('Lançado com sucesso!');

        // Adicionar transação localmente para demonstração
        const newTransaction = {
          id: Date.now(),
          type: selectedType,
          amount: parseFloat(amount),
          category: category || '🎁 Outros',
          description: description,
          time: 'Agora',
          typeLabel: typeConfig[selectedType].label,
        };

        setTransactions([newTransaction, ...transactions]);

        // Atualizar saldo/cartão localmente
        if (selectedType === 'debit') {
          setBalance(prev => prev - parseFloat(amount));
        } else if (selectedType === 'credit') {
          setCreditUsed(prev => prev + parseFloat(amount));
        } else if (selectedType === 'income' || selectedType === 'salary') {
          setBalance(prev => prev + parseFloat(amount));
        }

        setShowQuickAdd(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar! Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setAmount('');
    setCategory('');
    setDescription('');
  };

  const addQuickAmount = value => {
    setAmount((parseFloat(amount || 0) + value).toFixed(2));
  };

  const typeConfig = {
    debit: { icon: '💸', label: 'Débito', desc: 'Sai do saldo' },
    credit: { icon: '💳', label: 'Cartão', desc: 'Fatura cartão' },
    income: { icon: '💰', label: 'Entrada', desc: 'Vendas, extras' },
    salary: { icon: '🏦', label: 'Salário', desc: 'Recebimento' },
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 pb-20'>
      <Toaster position='top-center' />

      {/* Header com Saldo */}
      <div className='bg-white/95 backdrop-blur-lg sticky top-0 z-40 shadow-xl'>
        <div className='p-4'>
          <div className='bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white'>
            <p className='text-sm opacity-90 mb-2'>💰 Saldo Disponível</p>
            <h1 className='text-4xl font-bold mb-4'>
              € {balance.toFixed(2).replace('.', ',')}
            </h1>
            <div className='grid grid-cols-3 gap-4 pt-4 border-t border-white/20'>
              <div>
                <p className='text-2xl font-semibold'>€ 347,80</p>
                <p className='text-xs opacity-80'>Gastos Hoje</p>
              </div>
              <div>
                <p className='text-2xl font-semibold'>€ 2.847,30</p>
                <p className='text-xs opacity-80'>Gastos Mês</p>
              </div>
              <div>
                <p className='text-2xl font-semibold'>
                  € {creditUsed.toFixed(2).replace('.', ',')}
                </p>
                <p className='text-xs opacity-80'>Fatura Cartão</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className='flex gap-3 overflow-x-auto p-4 pb-6'>
          <div className='min-w-[140px] bg-white rounded-xl p-4 shadow-lg'>
            <CreditCard className='w-6 h-6 text-purple-600 mb-2' />
            <p className='text-xs text-gray-500'>Limite Cartão</p>
            <p className='text-xl font-bold'>
              € {Math.max(0, creditLimit - creditUsed).toFixed(0)}
            </p>
            <p className='text-xs text-gray-400'>Disponível</p>
          </div>
          <div className='min-w-[140px] bg-white rounded-xl p-4 shadow-lg'>
            <p className='text-2xl mb-2'>📅</p>
            <p className='text-xs text-gray-500'>Vencimento</p>
            <p className='text-xl font-bold'>15/09</p>
            <p className='text-xs text-red-500'>3 dias</p>
          </div>
          <div className='min-w-[140px] bg-white rounded-xl p-4 shadow-lg'>
            <p className='text-2xl mb-2'>🎯</p>
            <p className='text-xs text-gray-500'>Meta Mês</p>
            <p className='text-xl font-bold'>75%</p>
            <p className='text-xs text-gray-400'>€2.847/3.800</p>
          </div>
        </div>
      </div>

      {/* Info Cartão de Crédito */}
      <div className='px-4 mb-6'>
        <div className='bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white'>
          <div className='flex justify-between items-center mb-3'>
            <span className='text-sm'>💳 Visa Gold</span>
            <span className='text-xs'>Vence: 15/09</span>
          </div>
          <div className='bg-white/30 rounded-full h-2 overflow-hidden'>
            <div
              className='bg-white h-full transition-all duration-300'
              style={{
                width: `${Math.min((creditUsed / creditLimit) * 100, 100)}%`,
              }}
            />
          </div>
          <div className='flex justify-between mt-3 text-sm'>
            <span>Usado: € {creditUsed.toFixed(2).replace('.', ',')}</span>
            <span>Limite: € {creditLimit.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className='px-4'>
        <h2 className='text-white font-semibold mb-4 flex items-center gap-2'>
          <BarChart3 className='w-5 h-5' />
          Últimas Transações
        </h2>

        <div className='space-y-3'>
          {transactions.length === 0 ? (
            <div className='bg-white/20 rounded-xl p-8 text-center text-white'>
              <p className='text-lg mb-2'>Nenhuma transação ainda</p>
              <p className='text-sm opacity-80'>Clique no + para adicionar</p>
            </div>
          ) : (
            transactions.map(trans => (
              <div
                key={trans.id}
                className='bg-white/95 backdrop-blur rounded-xl p-4 flex justify-between items-center'
              >
                <div>
                  <p className='font-semibold text-gray-800'>
                    {trans.category}
                    {trans.description && ` - ${trans.description}`}
                  </p>
                  <p className='text-xs text-gray-500'>{trans.time}</p>
                </div>
                <div className='text-right'>
                  <p
                    className={`text-xl font-bold ${
                      trans.type === 'income' || trans.type === 'salary'
                        ? 'text-green-600'
                        : trans.type === 'credit'
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}
                  >
                    {trans.type === 'income' || trans.type === 'salary'
                      ? '+'
                      : '-'}{' '}
                    € {trans.amount.toFixed(2).replace('.', ',')}
                  </p>
                  <p className='text-xs text-gray-400'>{trans.typeLabel}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Botão Flutuante */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className='fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl transform transition-all active:scale-95'
      >
        <Plus className='w-8 h-8' />
      </button>

      {/* Bottom Navigation */}
      <div className='fixed bottom-0 left-0 right-0 bg-white border-t'>
        <div className='flex justify-around py-2'>
          <button className='flex flex-col items-center p-2 text-purple-600'>
            <HomeIcon className='w-6 h-6' />
            <span className='text-xs mt-1'>Início</span>
          </button>
          <button className='flex flex-col items-center p-2 text-gray-400'>
            <CreditCard className='w-6 h-6' />
            <span className='text-xs mt-1'>Cartão</span>
          </button>
          <button className='flex flex-col items-center p-2 text-gray-400'>
            <BarChart3 className='w-6 h-6' />
            <span className='text-xs mt-1'>Relatórios</span>
          </button>
          <button className='flex flex-col items-center p-2 text-gray-400'>
            <Settings className='w-6 h-6' />
            <span className='text-xs mt-1'>Config</span>
          </button>
        </div>
      </div>

      {/* Modal de Lançamento Rápido */}
      {showQuickAdd && (
        <div
          className='fixed inset-0 bg-black/50 z-50 flex items-end'
          onClick={() => setShowQuickAdd(false)}
        >
          <div
            className='bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto'
            onClick={e => e.stopPropagation()}
          >
            <div className='p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>⚡ Lançamento Rápido</h2>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center'
                >
                  ×
                </button>
              </div>

              {/* Seleção de Tipo */}
              <div className='grid grid-cols-2 gap-3 mb-6'>
                {Object.entries(typeConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedType(key)}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      selectedType === key
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className='text-3xl mb-2'>{config.icon}</div>
                    <div className='font-semibold'>{config.label}</div>
                    <div className='text-xs opacity-80'>{config.desc}</div>
                  </button>
                ))}
              </div>

              {/* Input de Valor */}
              <div className='mb-6'>
                <label className='text-sm text-gray-600 mb-2 block'>
                  Valor
                </label>
                <div className='relative'>
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-purple-600 font-bold'>
                    €
                  </span>
                  <input
                    type='number'
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder='0,00'
                    className='w-full pl-12 pr-4 py-4 text-3xl font-bold border-2 rounded-xl focus:border-purple-600 outline-none'
                    step='0.01'
                  />
                </div>

                {/* Botões Rápidos */}
                <div className='grid grid-cols-3 gap-2 mt-3'>
                  {[5, 10, 20, 50, 100].map(val => (
                    <button
                      key={val}
                      onClick={() => addQuickAmount(val)}
                      className='py-3 bg-gray-100 rounded-lg font-semibold active:bg-purple-600 active:text-white transition-all'
                    >
                      +{val}€
                    </button>
                  ))}
                  <button
                    onClick={() => setAmount('')}
                    className='py-3 bg-red-50 text-red-600 rounded-lg font-semibold'
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* Categoria */}
              <div className='mb-6'>
                <label className='text-sm text-gray-600 mb-2 block'>
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className='w-full px-4 py-3 border-2 rounded-xl focus:border-purple-600 outline-none'
                >
                  <option value=''>Selecione...</option>
                  {selectedType === 'income' || selectedType === 'salary' ? (
                    <>
                      <option>💰 Venda</option>
                      <option>🏦 Salário</option>
                      <option>💼 Freelance</option>
                      <option>🎁 Presente</option>
                      <option>📈 Investimento</option>
                    </>
                  ) : (
                    <>
                      <option>🍔 Alimentação</option>
                      <option>🚗 Transporte</option>
                      <option>🏠 Casa</option>
                      <option>💊 Saúde</option>
                      <option>🎮 Lazer</option>
                      <option>👕 Roupas</option>
                      <option>📚 Educação</option>
                      <option>🛒 Mercado</option>
                      <option>💡 Contas</option>
                      <option>🎁 Outros</option>
                    </>
                  )}
                </select>
              </div>

              {/* Descrição */}
              <div className='mb-6'>
                <label className='text-sm text-gray-600 mb-2 block'>
                  Descrição (opcional)
                </label>
                <input
                  type='text'
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder='Ex: Almoço, Uber, etc...'
                  className='w-full px-4 py-3 border-2 rounded-xl focus:border-purple-600 outline-none'
                />
              </div>

              {/* Botão Salvar */}
              <button
                onClick={handleQuickAdd}
                disabled={loading || !selectedType || !amount}
                className='w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 transition-all active:scale-[0.98]'
              >
                {loading ? 'Salvando...' : '💾 Salvar Lançamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
