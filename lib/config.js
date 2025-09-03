// Configurações centralizadas do app
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Minhas Finanças',
    version: '2.0.0',
  },
  currency: {
    symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '€',
    code: process.env.NEXT_PUBLIC_CURRENCY_CODE || 'EUR',
    locale: 'pt-PT',
  },
  defaults: {
    initialBalance: parseFloat(process.env.INITIAL_BALANCE || '4250.00'),
    creditLimit: parseFloat(process.env.CREDIT_LIMIT || '5000.00'),
    creditDueDay: parseInt(process.env.CREDIT_DUE_DAY || '15'),
  },
  auth: {
    jwtSecret:
      process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_123456789',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || '123456',
    sessionDuration: '7d',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  },
};

// Formatadores
export const formatters = {
  currency: value => {
    return new Intl.NumberFormat(config.currency.locale, {
      style: 'currency',
      currency: config.currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  },

  percentage: value => {
    return new Intl.NumberFormat(config.currency.locale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value / 100);
  },

  date: date => {
    return new Intl.DateTimeFormat(config.currency.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },

  shortDate: date => {
    return new Intl.DateTimeFormat(config.currency.locale, {
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(date));
  },
};

// Categorias padrão
export const categories = {
  expense: [
    { id: 'food', icon: '🍔', name: 'Alimentação', color: 'orange' },
    { id: 'transport', icon: '🚗', name: 'Transporte', color: 'blue' },
    { id: 'home', icon: '🏠', name: 'Casa', color: 'green' },
    { id: 'health', icon: '💊', name: 'Saúde', color: 'red' },
    { id: 'leisure', icon: '🎮', name: 'Lazer', color: 'purple' },
    { id: 'clothing', icon: '👕', name: 'Roupas', color: 'pink' },
    { id: 'education', icon: '📚', name: 'Educação', color: 'indigo' },
    { id: 'market', icon: '🛒', name: 'Mercado', color: 'yellow' },
    { id: 'bills', icon: '💡', name: 'Contas', color: 'gray' },
    { id: 'others', icon: '🎁', name: 'Outros', color: 'slate' },
  ],
  income: [
    { id: 'sale', icon: '💰', name: 'Venda', color: 'green' },
    { id: 'salary', icon: '🏦', name: 'Salário', color: 'blue' },
    { id: 'freelance', icon: '💼', name: 'Freelance', color: 'purple' },
    { id: 'gift', icon: '🎁', name: 'Presente', color: 'pink' },
    { id: 'investment', icon: '📈', name: 'Investimento', color: 'indigo' },
    { id: 'transfer', icon: '🔄', name: 'Transferência', color: 'gray' },
  ],
};

// Tipos de transação
export const transactionTypes = {
  debit: {
    id: 'debit',
    icon: '💸',
    label: 'Débito',
    desc: 'Sai do saldo',
    color: 'red',
    impact: 'negative',
  },
  credit: {
    id: 'credit',
    icon: '💳',
    label: 'Cartão',
    desc: 'Fatura cartão',
    color: 'orange',
    impact: 'negative',
  },
  income: {
    id: 'income',
    icon: '💰',
    label: 'Entrada',
    desc: 'Vendas, extras',
    color: 'green',
    impact: 'positive',
  },
  salary: {
    id: 'salary',
    icon: '🏦',
    label: 'Salário',
    desc: 'Recebimento',
    color: 'blue',
    impact: 'positive',
  },
};

// Validadores
export const validators = {
  amount: value => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  },

  category: value => {
    return value && value.length > 0;
  },

  description: value => {
    return value.length <= 100;
  },

  password: value => {
    return value && value.length >= 6;
  },

  username: value => {
    return value && value.length >= 3 && value.length <= 20;
  },
};
