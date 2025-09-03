'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function QuickAdd({ isOpen, onClose, onSave }) {
  const [selectedType, setSelectedType] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const typeConfig = {
    debit: {
      icon: '💸',
      label: 'Débito',
      desc: 'Sai do saldo',
      color: 'red',
    },
    credit: {
      icon: '💳',
      label: 'Cartão',
      desc: 'Fatura cartão',
      color: 'orange',
    },
    income: {
      icon: '💰',
      label: 'Entrada',
      desc: 'Vendas, extras',
      color: 'green',
    },
    salary: {
      icon: '🏦',
      label: 'Salário',
      desc: 'Recebimento',
      color: 'blue',
    },
  };

  const categories = {
    expense: [
      '🍔 Alimentação',
      '🚗 Transporte',
      '🏠 Casa',
      '💊 Saúde',
      '🎮 Lazer',
      '👕 Roupas',
      '📚 Educação',
      '🛒 Mercado',
      '💡 Contas',
      '🎁 Outros',
    ],
    income: [
      '💰 Venda',
      '🏦 Salário',
      '💼 Freelance',
      '🎁 Presente',
      '📈 Investimento',
      '🔄 Transferência',
      '💸 Outros',
    ],
  };

  const handleSave = () => {
    if (!selectedType || !amount) return;

    onSave({
      type: selectedType,
      amount: parseFloat(amount),
      category,
      description,
    });

    // Limpar form
    setSelectedType(null);
    setAmount('');
    setCategory('');
    setDescription('');
  };

  const addQuickAmount = value => {
    setAmount((parseFloat(amount || 0) + value).toFixed(2));
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/50 z-50 flex items-end animate-fade-in'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto animate-slide-up'
        onClick={e => e.stopPropagation()}
      >
        <div className='p-6'>
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold flex items-center gap-2'>
              ⚡ Lançamento Rápido
            </h2>
            <button
              onClick={onClose}
              className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Tipo Selection */}
          <div className='grid grid-cols-2 gap-3 mb-6'>
            {Object.entries(typeConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedType(key);
                  setCategory(''); // Reset categoria ao mudar tipo
                }}
                className={`p-5 rounded-xl border-2 transition-all transform active:scale-95 ${
                  selectedType === key
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className='text-3xl mb-2'>{config.icon}</div>
                <div className='font-semibold'>{config.label}</div>
                <div className='text-xs opacity-80'>{config.desc}</div>
              </button>
            ))}
          </div>

          {/* Valor Input */}
          <div className='mb-6'>
            <label className='text-sm text-gray-600 mb-2 block font-medium'>
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
                className='w-full pl-12 pr-4 py-4 text-3xl font-bold border-2 rounded-xl focus:border-purple-600 outline-none transition-colors'
                step='0.01'
                inputMode='decimal'
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className='grid grid-cols-3 gap-2 mt-3'>
              {[5, 10, 20, 50, 100].map(val => (
                <button
                  key={val}
                  onClick={() => addQuickAmount(val)}
                  className='py-3 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 active:bg-purple-600 active:text-white transition-all'
                >
                  +{val}€
                </button>
              ))}
              <button
                onClick={() => setAmount('')}
                className='py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 active:bg-red-600 active:text-white transition-all'
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Categoria */}
          <div className='mb-6'>
            <label className='text-sm text-gray-600 mb-2 block font-medium'>
              Categoria
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className='w-full px-4 py-3 border-2 rounded-xl focus:border-purple-600 outline-none transition-colors bg-white'
            >
              <option value=''>Selecione uma categoria...</option>
              {(selectedType === 'income' || selectedType === 'salary'
                ? categories.income
                : categories.expense
              ).map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div className='mb-6'>
            <label className='text-sm text-gray-600 mb-2 block font-medium'>
              Descrição (opcional)
            </label>
            <input
              type='text'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Ex: Almoço, Uber, Venda do PlayStation...'
              className='w-full px-4 py-3 border-2 rounded-xl focus:border-purple-600 outline-none transition-colors'
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!selectedType || !amount}
            className='w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-lg'
          >
            💾 Salvar Lançamento
          </button>
        </div>
      </div>
    </div>
  );
}
