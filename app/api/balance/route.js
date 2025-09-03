import { getDb } from '@/lib/db';

// GET - Obter saldo e resumo financeiro
export async function GET(request) {
  try {
    const db = await getDb();

    // Buscar saldo e informações da conta
    const account = await db.get(
      `SELECT 
        balance,
        credit_limit,
        credit_used,
        (credit_limit - credit_used) as credit_available
      FROM accounts 
      WHERE user_id = 1`
    );

    if (!account) {
      return Response.json({
        balance: 0,
        creditLimit: 5000,
        creditUsed: 0,
        creditAvailable: 5000,
        todayExpenses: 0,
        monthExpenses: 0,
        monthIncome: 0,
      });
    }

    // Calcular gastos de hoje
    const todayExpenses = await db.get(
      `SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = 1
        AND type IN ('debit', 'credit')
        AND DATE(created_at) = DATE('now', 'localtime')`
    );

    // Calcular gastos do mês
    const monthExpenses = await db.get(
      `SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = 1
        AND type IN ('debit', 'credit')
        AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', 'localtime')`
    );

    // Calcular receitas do mês
    const monthIncome = await db.get(
      `SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE user_id = 1
        AND type IN ('income', 'salary')
        AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', 'localtime')`
    );

    return Response.json({
      balance: account.balance,
      creditLimit: account.credit_limit,
      creditUsed: account.credit_used,
      creditAvailable: account.credit_available,
      todayExpenses: todayExpenses.total,
      monthExpenses: monthExpenses.total,
      monthIncome: monthIncome.total,
      monthBalance: monthIncome.total - monthExpenses.total,
    });
  } catch (error) {
    console.error('Erro ao buscar saldo:', error);
    return Response.json(
      { error: 'Erro ao buscar informações da conta' },
      { status: 500 }
    );
  }
}

// PUT - Ajustar saldo manualmente
export async function PUT(request) {
  try {
    const { adjustment, description = 'Ajuste manual' } = await request.json();

    if (!adjustment || isNaN(adjustment)) {
      return Response.json(
        { error: 'Valor de ajuste inválido' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Iniciar transação
    await db.run('BEGIN TRANSACTION');

    try {
      // Atualizar saldo
      await db.run(
        'UPDATE accounts SET balance = balance + ? WHERE user_id = 1',
        [adjustment]
      );

      // Registrar ajuste como transação
      const type = adjustment > 0 ? 'income' : 'debit';
      await db.run(
        `INSERT INTO transactions (user_id, type, amount, category, description)
        VALUES (?, ?, ?, ?, ?)`,
        [1, type, Math.abs(adjustment), '⚙️ Ajuste', description]
      );

      await db.run('COMMIT');

      // Buscar novo saldo
      const account = await db.get(
        'SELECT balance FROM accounts WHERE user_id = 1'
      );

      return Response.json({
        success: true,
        newBalance: account.balance,
        adjustment: adjustment,
      });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erro ao ajustar saldo:', error);
    return Response.json({ error: 'Erro ao ajustar saldo' }, { status: 500 });
  }
}
