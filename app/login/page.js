'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  TrendingUp,
  CreditCard,
  Wallet,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const { login, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const result = await login(username, password);

    if (!result.success) {
      // Shake animation on error
      const form = document.getElementById('login-form');
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
    }
  };

  const fillDemo = () => {
    setUsername('admin');
    setPassword('123456');
    toast('Credenciais de demonstração preenchidas!', {
      icon: '🎯',
      style: {
        borderRadius: '16px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const features = [
    {
      icon: Wallet,
      text: 'Controle total do seu dinheiro',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: CreditCard,
      text: 'Gestão de cartões inteligente',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      text: 'Análises e relatórios detalhados',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      text: 'Segurança e privacidade garantidas',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob'></div>
        <div className='absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000'></div>
        <div className='absolute bottom-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000'></div>
      </div>

      <div className='relative z-10 min-h-screen flex'>
        {/* Left Side - Features */}
        <div className='hidden lg:flex flex-1 items-center justify-center p-12'>
          <div className='max-w-lg'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center'>
                <Sparkles className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-4xl font-bold text-white'>
                  Minhas Finanças
                </h1>
                <p className='text-purple-200'>Gestão financeira inteligente</p>
              </div>
            </div>

            <div className='space-y-6'>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className='flex items-start gap-4 group cursor-pointer'
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300`}
                    >
                      <Icon className='w-6 h-6 text-white' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-white font-medium group-hover:translate-x-2 transition-transform duration-300'>
                        {feature.text}
                      </p>
                      <div className='h-0.5 bg-white/20 mt-2 group-hover:bg-white/40 transition-all duration-300'></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='mt-12 p-6 bg-white/10 backdrop-blur rounded-2xl border border-white/20'>
              <p className='text-purple-200 text-sm'>
                "A melhor ferramenta para controlar minhas finanças! Interface
                linda e super fácil de usar."
              </p>
              <div className='flex items-center gap-3 mt-4'>
                <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'></div>
                <div>
                  <p className='text-white font-medium text-sm'>Maria Silva</p>
                  <p className='text-purple-300 text-xs'>Usuária Premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className='flex-1 flex items-center justify-center p-6'>
          <div className='w-full max-w-md'>
            <div className='bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8'>
              {/* Header */}
              <div className='text-center mb-8'>
                <div className='w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300'>
                  <span className='text-3xl'>💰</span>
                </div>
                <h2 className='text-3xl font-bold text-white mb-2'>
                  Bem-vindo de volta!
                </h2>
                <p className='text-purple-200'>
                  Entre para continuar gerenciando suas finanças
                </p>
              </div>

              {/* Form */}
              <form
                id='login-form'
                onSubmit={handleSubmit}
                className='space-y-6'
              >
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-purple-200'>
                    Usuário
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder='Digite seu usuário'
                      className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-purple-400 focus:bg-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300'
                      disabled={loading}
                      autoComplete='username'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-purple-200'>
                    Senha
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder='Digite sua senha'
                      className='w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-purple-400 focus:bg-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300'
                      disabled={loading}
                      autoComplete='current-password'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 p-2 text-purple-300 hover:text-white transition-colors'
                    >
                      {showPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className='w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-purple-400 focus:ring-2 text-purple-600'
                    />
                    <span className='text-sm text-purple-200'>
                      Lembrar de mim
                    </span>
                  </label>

                  <button
                    type='button'
                    className='text-sm text-purple-300 hover:text-white transition-colors'
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group'
                >
                  {loading ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ChevronRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Account */}
              <div className='mt-6 pt-6 border-t border-white/10'>
                <button
                  onClick={fillDemo}
                  className='w-full py-3 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium'
                >
                  🎯 Usar conta de demonstração
                </button>
              </div>

              {/* Footer */}
              <div className='mt-6 text-center'>
                <p className='text-purple-300 text-xs'>
                  Não tem uma conta?{' '}
                  <button className='text-white font-medium hover:underline'>
                    Criar agora
                  </button>
                </p>
              </div>
            </div>

            {/* Version */}
            <p className='text-center text-purple-300 text-xs mt-6'>
              v2.0.0 - © 2024 Minhas Finanças
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
