const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

async function initializeDatabase() {
  console.log('🚀 Inicializando banco de dados...');
  console.log('📁 Caminho:', path.join(process.cwd(), 'database.sqlite'));

  const db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database,
  });

  try {
    // Criar tabelas
    await db.exec(`
      -- Tabela de usuários
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        full_name TEXT,
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
        name TEXT NOT NULL,
        icon TEXT,
        type TEXT CHECK(type IN ('expense', 'income'))
      );
      
      -- Índices
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
      CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
    `);

    console.log('✅ Tabelas criadas com sucesso');

    // Valores padrão
    const adminUsername = 'admin';
    const adminPassword = '123456';
    const initialBalance = 4250.0;
    const creditLimit = 5000.0;
    const creditDueDay = 15;

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Verificar se usuário já existe
    const existingUser = await db.get(
      'SELECT id FROM users WHERE username = ?',
      [adminUsername]
    );

    let userId;
    if (!existingUser) {
      const result = await db.run(
        `INSERT INTO users (username, password, email, full_name) 
         VALUES (?, ?, ?, ?)`,
        [adminUsername, hashedPassword, 'admin@financas.app', 'Administrador']
      );
      userId = result.lastID;
      console.log(
        `✅ Usuário ${adminUsername} criado (senha: ${adminPassword})`
      );
    } else {
      userId = existingUser.id;
      console.log(`ℹ️  Usuário ${adminUsername} já existe`);
    }

    // Verificar se conta existe
    const existingAccount = await db.get(
      'SELECT id FROM accounts WHERE user_id = ?',
      [userId]
    );

    if (!existingAccount) {
      await db.run(
        `INSERT INTO accounts (user_id, balance, credit_limit, credit_used, credit_due_day)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, initialBalance, creditLimit, 0, creditDueDay]
      );
      console.log(`✅ Conta criada com saldo inicial de €${initialBalance}`);
    } else {
      console.log('ℹ️  Conta já existe');
    }

    // Inserir categorias padrão
    const categories = [
      // Despesas
      ['🍔 Alimentação', '🍔', 'expense'],
      ['🚗 Transporte', '🚗', 'expense'],
      ['🏠 Casa', '🏠', 'expense'],
      ['💊 Saúde', '💊', 'expense'],
      ['🎮 Lazer', '🎮', 'expense'],
      ['👕 Roupas', '👕', 'expense'],
      ['📚 Educação', '📚', 'expense'],
      ['🛒 Mercado', '🛒', 'expense'],
      ['💡 Contas', '💡', 'expense'],
      ['🎁 Outros', '🎁', 'expense'],
      // Receitas
      ['💰 Venda', '💰', 'income'],
      ['🏦 Salário', '🏦', 'income'],
      ['💼 Freelance', '💼', 'income'],
      ['🎁 Presente', '🎁', 'income'],
      ['📈 Investimento', '📈', 'income'],
    ];

    for (const [name, icon, type] of categories) {
      // Verificar se categoria já existe
      const existing = await db.get(
        'SELECT id FROM categories WHERE name = ?',
        [name]
      );
      if (!existing) {
        await db.run(
          'INSERT INTO categories (name, icon, type) VALUES (?, ?, ?)',
          [name, icon, type]
        );
      }
    }
    console.log('✅ Categorias padrão criadas');

    // Adicionar algumas transações de exemplo
    const sampleTransactions = [
      [userId, 'debit', 12.5, '🍔 Alimentação', 'Almoço no restaurante'],
      [userId, 'credit', 45.0, '🛒 Mercado', 'Compras Continente'],
      [userId, 'debit', 3.5, '☕ Alimentação', 'Café da manhã'],
      [userId, 'income', 250.0, '💼 Freelance', 'Projeto website'],
      [userId, 'salary', 3500.0, '🏦 Salário', 'Salário mensal'],
    ];

    // Verificar se já existem transações
    const transactionCount = await db.get(
      'SELECT COUNT(*) as count FROM transactions WHERE user_id = ?',
      [userId]
    );

    if (transactionCount.count === 0) {
      for (const trans of sampleTransactions) {
        await db.run(
          `INSERT INTO transactions (user_id, type, amount, category, description)
           VALUES (?, ?, ?, ?, ?)`,
          trans
        );
      }
      console.log('✅ Transações de exemplo adicionadas');
    } else {
      console.log('ℹ️  Transações já existem');
    }

    // Estatísticas
    const stats = await db.get(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM transactions) as transactions,
        (SELECT COUNT(*) FROM categories) as categories
    `);

    console.log('\n📊 Estatísticas do Banco:');
    console.log(`   Usuários: ${stats.users}`);
    console.log(`   Transações: ${stats.transactions}`);
    console.log(`   Categorias: ${stats.categories}`);
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await db.close();
  }

  console.log('\n🎉 Banco de dados inicializado com sucesso!');
  console.log('📝 Credenciais de acesso:');
  console.log('   Usuário: admin');
  console.log('   Senha: 123456');
  console.log('\n🚀 Execute "npm run dev" para iniciar o aplicativo');
}

// Executar
initializeDatabase().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
