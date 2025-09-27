'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

// Contexts
import { useAuth } from '@/contexts/AuthContext';
import { useFinance } from '@/contexts/FinanceContext';

// Components
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import BalanceCard from '@/components/dashboard/BalanceCard';
import CreditCard from '@/components/dashboard/CreditCard';
import TransactionList from '@/components/dashboard/TransactionList';
import QuickAdd from '@/components/dashboard/QuickAdd';
import StatsCards from '@/components/dashboard/StatsCards';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    balance,
    creditLimit,
    creditUsed,
    creditDueDay,
    creditAvailable,
    transactions,
    stats,
    loading,
    loadAllData,
    addTransaction,
    getCreditPercentage,
    getDaysUntilDue,
  } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState('home');

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Handler para adicionar transação
  const handleAddTransaction = async transaction => {
    const result = await addTransaction(transaction);
    if (result.success) {
      toast.success('Transação adicionada com sucesso!');
      setShowAddModal(false);
    } else {
      toast.error(result.error || 'Erro ao adicionar transação');
    }
  };

  // Handler para refresh
  const handleRefresh = async () => {
    await loadAllData();
    toast.success('Dados atualizados!');
  };

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  const creditPercentage = getCreditPercentage();
  const daysUntilDue = getDaysUntilDue();
  const monthBalance = stats.monthIncome - stats.monthExpenses;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <Header user={user} onRefresh={handleRefresh} loading={loading} />

      {/* Main Content */}
      <main className='container mx-auto px-4 pb-24'>
        <div className='py-6 space-y-6'>
          {/* Balance Card */}
          <BalanceCard
            balance={balance}
            todayExpenses={stats.todayExpenses}
            monthExpenses={stats.monthExpenses}
            monthIncome={stats.monthIncome}
          />

          {/* Stats Cards */}
          <StatsCards
            creditLimit={creditLimit}
            creditUsed={creditUsed}
            creditAvailable={creditAvailable}
            daysUntilDue={daysUntilDue}
            monthBalance={monthBalance}
          />

          {/* Credit Card */}
          <CreditCard
            limit={creditLimit}
            used={creditUsed}
            dueDay={creditDueDay}
            percentage={creditPercentage}
          />

          {/* Transactions List */}
          <div className='bg-white rounded-2xl shadow-lg p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-gray-800'>
                Últimas Transações
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className='text-purple-600 hover:text-purple-700 font-medium text-sm'
              >
                Ver todas →
              </button>
            </div>
            <TransactionList transactions={transactions} loading={loading} />
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeView={activeView} onViewChange={setActiveView} />

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className='fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-40'
      >
        <Plus className='w-6 h-6' />
      </button>

      {/* Quick Add Modal */}
      <QuickAdd
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTransaction}
      />
    </div>
  );
}
