'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { config } from '@/lib/config';

const FinanceContext = createContext({});

export function FinanceProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(config.defaults.initialBalance);
  const [creditLimit, setCreditLimit] = useState(config.defaults.creditLimit);
  const [creditUsed, setCreditUsed] = useState(0);
  const [creditDueDay, setCreditDueDay] = useState(
    config.defaults.creditDueDay
  );
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    todayExpenses: 0,
    monthExpenses: 0,
    monthIncome: 0,
  });

  // Carregar dados quando autenticado
  useEffect(() => {
    if (isAuthenticated && token) {
      loadAllData();
    }
  }, [isAuthenticated, token]);

  const loadAllData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      await Promise.all([loadBalance(), loadCreditCard(), loadTransactions()]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadBalance = async () => {
    try {
      const response = await fetch('/api/balance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
        setStats({
          todayExpenses: data.todayExpenses || 0,
          monthExpenses: data.monthExpenses || 0,
          monthIncome: data.monthIncome || 0,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
    }
  };

  const loadCreditCard = async () => {
    try {
      const response = await fetch('/api/credit-card', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCreditLimit(data.limit || config.defaults.creditLimit);
        setCreditUsed(data.used || 0);
        setCreditDueDay(data.dueDay || config.defaults.creditDueDay);
      }
    } catch (error) {
      console.error('Erro ao carregar cartão:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch('/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  const addTransaction = async transactionData => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        await loadAllData(); // Recarregar todos os dados
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      return { success: false, error: 'Erro ao salvar transação' };
    }
  };

  const payBill = async (paymentType, amount) => {
    try {
      const response = await fetch('/api/credit-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentType, amount }),
      });

      if (response.ok) {
        await loadAllData();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Erro ao pagar fatura:', error);
      return { success: false, error: 'Erro ao processar pagamento' };
    }
  };

  const updateCreditSettings = async settings => {
    try {
      const response = await fetch('/api/credit-card', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        await loadCreditCard();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      return { success: false, error: 'Erro ao atualizar configurações' };
    }
  };

  const adjustBalance = async (adjustment, description) => {
    try {
      const response = await fetch('/api/balance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adjustment, description }),
      });

      if (response.ok) {
        await loadAllData();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Erro ao ajustar saldo:', error);
      return { success: false, error: 'Erro ao ajustar saldo' };
    }
  };

  const value = {
    // Estado
    balance,
    creditLimit,
    creditUsed,
    creditDueDay,
    creditAvailable: creditLimit - creditUsed,
    transactions,
    stats,
    loading,

    // Ações
    loadAllData,
    addTransaction,
    payBill,
    updateCreditSettings,
    adjustBalance,

    // Cálculos úteis
    getCreditPercentage: () => (creditUsed / creditLimit) * 100,
    getDaysUntilDue: () => {
      const today = new Date();
      const currentDay = today.getDate();
      if (creditDueDay >= currentDay) {
        return creditDueDay - currentDay;
      } else {
        const daysInMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();
        return daysInMonth - currentDay + creditDueDay;
      }
    },
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
};
