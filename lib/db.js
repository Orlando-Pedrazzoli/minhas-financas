import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

let db = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        balance DECIMAL(10,2) DEFAULT 0,
        credit_limit DECIMAL(10,2) DEFAULT 5000,
        credit_used DECIMAL(10,2) DEFAULT 0,
        credit_due_day INTEGER DEFAULT 15,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT CHECK(type IN ('debit', 'credit', 'income', 'salary')),
        amount DECIMAL(10,2),
        category TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        icon TEXT,
        type TEXT CHECK(type IN ('expense', 'income'))
      );
    `);

    // Criar usuário padrão
    const hashedPassword = await bcrypt.hash('123456', 10);
    await db.run(
      'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)',
      ['admin', hashedPassword]
    );

    // Criar conta padrão
    await db.run(`
      INSERT OR IGNORE INTO accounts (user_id, balance, credit_limit, credit_used)
      VALUES (1, 4250.00, 5000.00, 0.00)
    `);

    // Adicionar categorias padrão
    const categories = [
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
      ['Venda', '💰', 'income'],
      ['Salário', '🏦', 'income'],
      ['Freelance', '💼', 'income'],
      ['Presente', '🎁', 'income'],
      ['Investimento', '📈', 'income'],
    ];

    for (const [name, icon, type] of categories) {
      await db.run(
        'INSERT OR IGNORE INTO categories (name, icon, type) VALUES (?, ?, ?)',
        [name, icon, type]
      );
    }
  }

  return db;
}
