import { getDb } from '@/lib/db';

export async function GET(request) {
  const db = await getDb();

  const transactions = await db.all(`
    SELECT t.*, c.icon, c.name as category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category = c.name
    WHERE t.user_id = 1
    ORDER BY t.created_at DESC
    LIMIT 20
  `);

  return Response.json(
    transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      category: `${t.icon || ''} ${t.category_name || t.category}`,
      description: t.description,
      time: new Date(t.created_at).toLocaleString('pt-BR'),
      typeLabel: {
        debit: 'Débito',
        credit: 'Cartão',
        income: 'Entrada',
        salary: 'Salário',
      }[t.type],
    }))
  );
}

export async function POST(request) {
  const db = await getDb();
  const data = await request.json();

  try {
    // Iniciar transação
    await db.run('BEGIN TRANSACTION');

    // Inserir transação
    await db.run(
      `INSERT INTO transactions (user_id, type, amount, category, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [1, data.type, data.amount, data.category, data.description]
    );

    // Atualizar saldo ou cartão
    if (data.type === 'debit') {
      await db.run(
        'UPDATE accounts SET balance = balance - ? WHERE user_id = 1',
        [data.amount]
      );
    } else if (data.type === 'credit') {
      await db.run(
        'UPDATE accounts SET credit_used = credit_used + ? WHERE user_id = 1',
        [data.amount]
      );
    } else if (data.type === 'income' || data.type === 'salary') {
      await db.run(
        'UPDATE accounts SET balance = balance + ? WHERE user_id = 1',
        [data.amount]
      );
    }

    await db.run('COMMIT');

    return Response.json({ success: true });
  } catch (error) {
    await db.run('ROLLBACK');
    return Response.json({ error: error.message }, { status: 500 });
  }
}
