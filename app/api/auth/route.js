import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_123456789';

// POST - Login
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { error: 'Username e password são obrigatórios' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Buscar usuário
    const user = await db.get(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return Response.json(
        { error: 'Usuário ou senha inválidos' },
        { status: 401 }
      );
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return Response.json(
        { error: 'Usuário ou senha inválidos' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Buscar dados da conta
    const account = await db.get(
      'SELECT balance, credit_limit, credit_used FROM accounts WHERE user_id = ?',
      [user.id]
    );

    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
      },
      account: account || {
        balance: 0,
        credit_limit: 5000,
        credit_used: 0,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return Response.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}

// GET - Verificar autenticação
export async function GET(request) {
  try {
    // Pegar token do header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ authenticated: false }, { status: 401 });
    }

    const token = authHeader.substring(7);

    try {
      // Verificar token
      const decoded = jwt.verify(token, JWT_SECRET);

      const db = await getDb();

      // Verificar se usuário existe
      const user = await db.get('SELECT id, username FROM users WHERE id = ?', [
        decoded.id,
      ]);

      if (!user) {
        return Response.json({ authenticated: false }, { status: 401 });
      }

      return Response.json({
        authenticated: true,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      return Response.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return Response.json(
      { error: 'Erro ao verificar autenticação' },
      { status: 500 }
    );
  }
}

// PUT - Alterar senha
export async function PUT(request) {
  try {
    const { currentPassword, newPassword, username } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json(
        { error: 'Senha atual e nova senha são obrigatórias' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Por enquanto usar username padrão se não enviado
    const user = await db.get(
      'SELECT id, password FROM users WHERE username = ?',
      [username || 'admin']
    );

    if (!user) {
      return Response.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar senha atual
    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return Response.json({ error: 'Senha atual incorreta' }, { status: 401 });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await db.run('UPDATE users SET password = ? WHERE id = ?', [
      hashedPassword,
      user.id,
    ]);

    return Response.json({
      success: true,
      message: 'Senha alterada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return Response.json({ error: 'Erro ao alterar senha' }, { status: 500 });
  }
}
