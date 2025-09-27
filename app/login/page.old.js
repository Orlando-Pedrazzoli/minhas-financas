'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setIsLoading(true);

    // Simular login (sem contexto por enquanto)
    if (username === 'admin' && password === '123456') {
      // Salvar token simples no localStorage
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({ username: 'admin' }));

      // Redirecionar para dashboard
      router.push('/dashboard');
    } else {
      setError('Usuário ou senha inválidos');
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setUsername('admin');
    setPassword('123456');
    setError('');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-black/10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, transparent 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Login Card */}
      <div className='relative w-full max-w-md'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-xl opacity-75'></div>

        <div className='relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8'>
          {/* Logo */}
          <div className='flex justify-center mb-8'>
            <div className='w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform'>
              <span className='text-3xl'>💰</span>
            </div>
          </div>

          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              Minhas Finanças
            </h1>
            <p className='text-gray-600 mt-2'>
              Gerencie suas finanças com inteligência
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm'>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Usuário
              </label>
              <input
                id='username'
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder='Digite seu usuário'
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all'
                disabled={isLoading}
                autoComplete='username'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Senha
              </label>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='Digite sua senha'
                  className='w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all'
                  disabled={isLoading}
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors'
                  tabIndex={-1}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex items-center justify-center gap-2'
            >
              {isLoading ? (
                <>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Entrando...
                </>
              ) : (
                <>➡️ Entrar</>
              )}
            </button>
          </form>

          {/* Demo Account */}
          <div className='mt-6 pt-6 border-t border-gray-200'>
            <button
              onClick={fillDemo}
              className='w-full py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors'
            >
              🎯 Usar conta de demonstração (admin/123456)
            </button>
          </div>

          {/* Footer */}
          <div className='mt-6 text-center text-xs text-gray-500'>
            <p>Versão 2.0.0</p>
            <p className='mt-1'>
              © 2024 Minhas Finanças. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
