'use client';

import { useState } from 'react';
import { X, Calculator, Calendar, FileText } from 'lucide-react';
import { categories, transactionTypes, validators } from '@/lib/config';

export default function QuickAdd({ isOpen, onClose, onSave }) {
  const [selectedType, setSelectedType] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedType) {
      newErrors.type = 'Selecione um tipo de transação';
    }

    if (!amount || !validators.amount(amount)) {
      newErrors.amount = 'Insira um valor válido maior que zero';
    }

    if (!category) {
      newErrors.category = 'Selecione uma categoria';
    }

    if (description && !validators.description(description)) {
      newErrors.description = 'Descrição muito longa (máx. 100 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    await onSave({
      type: selectedType,
      amount: parseFloat(amount),
      category,
      description,
    });

    // Reset form
    setSelectedType(null);
    setAmount('');
    setCategory('');
    setDescription('');
    setErrors({});
    setIsLoading(false);
  };

  const addQuickAmount = value => {
    const currentAmount = parseFloat(amount || 0);
    setAmount((currentAmount + value).toFixed(2));
    setErrors({ ...errors, amount: undefined });
  };

  const getCategoryOptions = () => {
    if (selectedType === 'income' || selectedType === 'salary') {
      return categories.income;
    }
    return categories.expense;
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-fade-in'>
      <div className='absolute inset-0' onClick={onClose} />

      <div className='relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden animate-slide-up'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                Nova Transação
              </h2>
              <p className='text-sm text-gray-500 mt-1'>
                Adicione uma nova movimentação
              </p>
            </div>
            <button
              onClick={onClose}
              className='w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
            >
              <X className='w-5 h-5 text-gray-600' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          {/* Transaction Type */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Tipo de Transação
            </label>
            <div className='grid grid-cols-2 gap-3'>
              {Object.entries(transactionTypes).map(([key, type]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedType(key);
                    setCategory('');
                    setErrors({ ...errors, type: undefined });
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedType === key
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className='text-2xl mb-2'>{type.icon}</div>
                  <div className='font-semibold text-gray-800'>
                    {type.label}
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>{type.desc}</div>
                </button>
              ))}
            </div>
            {errors.type && (
              <p className='text-red-500 text-xs mt-2'>{errors.type}</p>
            )}
          </div>

          {/* Amount */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Valor
            </label>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-purple-600 font-bold'>
                €
              </span>
              <input
                type='number'
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  setErrors({ ...errors, amount: undefined });
                }}
                placeholder='0,00'
                className={`w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 rounded-2xl outline-none transition-all ${
                  errors.amount
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                }`}
                step='0.01'
                inputMode='decimal'
              />
              <Calculator className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            </div>
            {errors.amount && (
              <p className='text-red-500 text-xs mt-2'>{errors.amount}</p>
            )}

            {/* Quick amounts */}
            <div className='grid grid-cols-5 gap-2 mt-3'>
              {[5, 10, 20, 50, 100].map(val => (
                <button
                  key={val}
                  onClick={() => addQuickAmount(val)}
                  className='py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-sm active:bg-purple-600 active:text-white transition-all'
                >
                  +{val}€
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Categoria
            </label>
            <div className='grid grid-cols-3 gap-2'>
              {getCategoryOptions().map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(`${cat.icon} ${cat.name}`);
                    setErrors({ ...errors, category: undefined });
                  }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    category === `${cat.icon} ${cat.name}`
                      ? 'bg-purple-50 border-purple-500 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className='text-2xl mb-1'>{cat.icon}</div>
                  <div className='text-xs font-medium text-gray-700'>
                    {cat.name}
                  </div>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className='text-red-500 text-xs mt-2'>{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Descrição (opcional)
            </label>
            <div className='relative'>
              <FileText className='absolute left-4 top-4 w-5 h-5 text-gray-400' />
              <input
                type='text'
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  setErrors({ ...errors, description: undefined });
                }}
                placeholder='Ex: Almoço no restaurante, Uber para o trabalho...'
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                  errors.description
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                }`}
                maxLength='100'
              />
              <span className='absolute right-4 top-4 text-xs text-gray-400'>
                {description.length}/100
              </span>
            </div>
            {errors.description && (
              <p className='text-red-500 text-xs mt-2'>{errors.description}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 bg-white border-t border-gray-100 p-6'>
          <div className='flex gap-3'>
            <button
              onClick={onClose}
              className='flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all'
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !selectedType || !amount || !category}
              className='flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]'
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
