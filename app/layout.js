'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang='pt-PT' className={inter.variable}>
      <head>
        <title>Minhas Finanças - Gestão Financeira Inteligente</title>
        <meta
          name='description'
          content='Sistema de gestão financeira pessoal moderno e intuitivo'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover'
        />
        <meta name='theme-color' content='#6366f1' />
        <link rel='manifest' href='/manifest.json' />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <FinanceProvider>
            {children}
            <Toaster
              position='top-center'
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '14px',
                },
                success: {
                  style: {
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#667eea',
                  },
                },
                error: {
                  style: {
                    background:
                      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#f5576c',
                  },
                },
                loading: {
                  style: {
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                },
              }}
            />
          </FinanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
