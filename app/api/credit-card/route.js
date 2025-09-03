import { getDb } from '@/lib/db';

// GET - Obter informações do cartão
export async function GET(request) {
  try {
    const db = await getDb();

    // Por enquanto usar user_id = 1 (admin)
    const account = await db.get(
      `SELECT 
        credit_limit,
        credit_used,
        credit_due_day,
        (credit_limit - credit_used) as credit_available
      FROM accounts 
      WHERE user_id = 1`
    );

    if (!account) {
      return Response.json({
        limit: 5000,
        used: 0,
        available: 5000,
        dueDay: 15,
      });
    }

    // Calcular dias até o vencimento
    const today = new Date();
    const currentDay = today.getDate();
    const dueDay = account.credit_due_day || 15;

    let daysUntilDue;
    if (dueDay >= currentDay) {
      daysUntilDue = dueDay - currentDay;
    } else {
      // Vencimento é no próximo mês
      const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();
      daysUntilDue = daysInMonth - currentDay + dueDay;
    }

    // Buscar últimas transações do cartão
    const transactions = await db.all(
      `SELECT 
        amount,
        category,
        description,
        created_at
      FROM transactions 
      WHERE user_id = 1 AND type = 'credit'
      ORDER BY created_at DESC
      LIMIT 10`
    );

    // Calcular gastos por categoria
    const categorySpending = await db.all(
      `SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions 
      WHERE user_id = 1 
        AND type = 'credit'
        AND datetime(created_at) >= datetime('now', '-30 days')
      GROUP BY category
      ORDER BY total DESC`
    );

    return Response.json({
      limit: account.credit_limit,
      used: account.credit_used,
      available: account.credit_available,
      dueDay: account.credit_due_day,
      daysUntilDue,
      percentUsed: (account.credit_used / account.credit_limit) * 100,
      recentTransactions: transactions,
      categoryBreakdown: categorySpending,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do cartão:', error);
    return Response.json(
      { error: 'Erro ao buscar dados do cartão' },
      { status: 500 }
    );
  }
}

// POST - Pagar fatura do cartão
export async function POST(request) {
  try {
    const { amount, paymentType = 'full' } = await request.json();

    const db = await getDb();

    // Buscar informações atuais
    const account = await db.get(
      'SELECT balance, credit_used FROM accounts WHERE user_id = 1'
    );

    if (!account) {
      return Response.json({ error: 'Conta não encontrada' }, { status: 404 });
    }

    // Determinar valor a pagar
    let paymentAmount;
    if (paymentType === 'full') {
      paymentAmount = account.credit_used;
    } else if (paymentType === 'minimum') {
      paymentAmount = Math.min(account.credit_used * 0.15, account.credit_used); // 15% ou total
    } else {
      paymentAmount = parseFloat(amount) || 0;
    }

    // Verificar se tem saldo suficiente
    if (paymentAmount > account.balance) {
      return Response.json(
        { error: 'Saldo insuficiente para pagar a fatura' },
        { status: 400 }
      );
    }

    // Iniciar transação
    await db.run('BEGIN TRANSACTION');

    try {
      // Deduzir do saldo e do cartão
      await db.run(
        `UPDATE accounts 
        SET balance = balance - ?,
            credit_used = credit_used - ?
        WHERE user_id = 1`,
        [paymentAmount, paymentAmount]
      );

      // Registrar transação de pagamento
      await db.run(
        `INSERT INTO transactions (user_id, type, amount, category, description)
        VALUES (?, ?, ?, ?, ?)`,
        [
          1,
          'debit',
          paymentAmount,
          '💳 Pagamento Cartão',
          `Pagamento ${
            paymentType === 'full'
              ? 'total'
              : paymentType === 'minimum'
              ? 'mínimo'
              : 'parcial'
          } da fatura`,
        ]
      );

      await db.run('COMMIT');

      // Buscar dados atualizados
      const updatedAccount = await db.get(
        'SELECT balance, credit_used, credit_limit FROM accounts WHERE user_id = 1'
      );

      return Response.json({
        success: true,
        paidAmount: paymentAmount,
        newBalance: updatedAccount.balance,
        newCreditUsed: updatedAccount.credit_used,
        creditAvailable:
          updatedAccount.credit_limit - updatedAccount.credit_used,
      });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erro ao pagar fatura:', error);
    return Response.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar limite ou data de vencimento
export async function PUT(request) {
  try {
    const { creditLimit, dueDay } = await request.json();

    const db = await getDb();

    const updates = [];
    const values = [];

    if (creditLimit !== undefined) {
      updates.push('credit_limit = ?');
      values.push(creditLimit);
    }

    if (dueDay !== undefined) {
      updates.push('credit_due_day = ?');
      values.push(dueDay);
    }

    if (updates.length === 0) {
      return Response.json(
        { error: 'Nenhum dado para atualizar' },
        { status: 400 }
      );
    }

    values.push(1); // user_id

    await db.run(
      `UPDATE accounts SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    // Buscar dados atualizados
    const account = await db.get(
      'SELECT credit_limit, credit_used, credit_due_day FROM accounts WHERE user_id = 1'
    );

    return Response.json({
      success: true,
      limit: account.credit_limit,
      used: account.credit_used,
      available: account.credit_limit - account.credit_used,
      dueDay: account.credit_due_day,
    });
  } catch (error) {
    console.error('Erro ao atualizar cartão:', error);
    return Response.json(
      { error: 'Erro ao atualizar configurações do cartão' },
      { status: 500 }
    );
  }
}

// DELETE - Zerar fatura do cartão (reset mensal)
export async function DELETE(request) {
  try {
    const db = await getDb();

    // Zerar fatura do cartão
    await db.run('UPDATE accounts SET credit_used = 0 WHERE user_id = 1');

    // Opcionalmente, arquivar transações antigas do cartão
    await db.run(
      `UPDATE transactions 
      SET description = description || ' [FATURA PAGA]'
      WHERE user_id = 1 
        AND type = 'credit'
        AND description NOT LIKE '%[FATURA PAGA]%'`
    );

    return Response.json({
      success: true,
      message: 'Fatura do cartão foi zerada',
    });
  } catch (error) {
    console.error('Erro ao zerar fatura:', error);
    return Response.json({ error: 'Erro ao zerar fatura' }, { status: 500 });
  }
}
