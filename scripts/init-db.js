const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

async function initializeDatabase() {
  console.log('🚀 Inicializando banco de dados...');

  const db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database,
  });

  // Criar tabelas
  await db.exec(`
    -- Tabela de usuários
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Tabela de contas
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      balance DECIMAL(10,2) DEFAULT 0,
      credit_limit DECIMAL(10,2) DEFAULT 5000,
      credit_used DECIMAL(10,2) DEFAULT 0,
      credit_due_day INTEGER DEFAULT 15,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    -- Tabela de transações
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT CHECK(type IN ('debit', 'credit', 'income', 'salary')),
      amount DECIMAL(10,2) NOT NULL,
      category TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    -- Tabela de categorias
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      icon TEXT,
      type TEXT CHECK(type IN ('expense', 'income'))
    );
    
    -- Índices para performance
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
  `);

  console.log('✅ Tabelas criadas');

  // Criar usuário padrão
  const hashedPassword = await bcrypt.hash('123456', 10);

  try {
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [
      'admin',
      hashedPassword,
    ]);
    console.log('✅ Usuário admin criado (senha: 123456)');
  } catch (e) {
    console.log('ℹ️ Usuário admin já existe');
  }

  // Criar conta padrão
  const user = await db.get('SELECT id FROM users WHERE username = ?', [
    'admin',
  ]);

  if (user) {
    const account = await db.get('SELECT id FROM accounts WHERE user_id = ?', [
      user.id,
    ]);

    if (!account) {
      await db.run(
        `INSERT INTO accounts (user_id, balance, credit_limit, credit_used, credit_due_day)
         VALUES (?, ?, ?, ?, ?)`,
        [user.id, 4250.0, 5000.0, 0.0, 15]
      );
      console.log('✅ Conta criada com saldo inicial de €4250');
    }
  }

  // Inserir categorias
  const categories = [
    // Despesas
    ['Alimentação', '🍔', 'expense'],
    ['Transporte', '🚗', 'expense'],
    ['Casa', '🏠', 'expense'],
    ['Saúde', '💊', 'expense'],
    ['Lazer', '🎮', 'expense'],
    ['Roupas', '👕', 'expense'],
    ['Educação', '📚', 'expense'],
    ['Mercado', '🛒', 'expense'],
    ['Contas', '💡', 'expense'],
    ['Outros', '🎁', 'expense'],
    // Receitas
    ['Venda', '💰', 'income'],
    ['Salário', '🏦', 'income'],
    ['Freelance', '💼', 'income'],
    ['Presente', '🎁', 'income'],
    ['Investimento', '📈', 'income'],
    ['Transferência', '🔄', 'income'],
  ];

  for (const [name, icon, type] of categories) {
    try {
      await db.run(
        'INSERT INTO categories (name, icon, type) VALUES (?, ?, ?)',
        [name, icon, type]
      );
    } catch (e) {
      // Categoria já existe, ignorar
    }
  }

  console.log('✅ Categorias criadas');

  // Adicionar algumas transações de exemplo
  const sampleTransactions = [
    [1, 'debit', 5.3, '🍔 Alimentação', 'Padaria Silva', '2024-09-03 14:30:00'],
    [
      1,
      'credit',
      67.5,
      '🍔 Alimentação',
      'Pizza Express',
      '2024-09-03 12:15:00',
    ],
    [1, 'income', 150.0, '💰 Venda', 'PlayStation', '2024-09-02 18:00:00'],
    [
      1,
      'debit',
      85.0,
      '🚗 Transporte',
      'Gasolina Shell',
      '2024-09-02 09:00:00',
    ],
    [1, 'credit', 234.9, '🛒 Mercado', 'Continente', '2024-09-01 16:30:00'],
  ];

  for (const trans of sampleTransactions) {
    await db.run(
      `INSERT INTO transactions (user_id, type, amount, category, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      trans
    );
  }

  console.log('✅ Transações de exemplo adicionadas');

  await db.close();

  console.log('\n🎉 Banco de dados inicializado com sucesso!');
  console.log('📝 Login: admin / 123456');
  console.log('💰 Saldo inicial: €4250.00');
  console.log('💳 Limite do cartão: €5000.00');
}

initializeDatabase().catch(console.error);
