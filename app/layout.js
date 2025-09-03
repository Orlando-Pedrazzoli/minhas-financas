import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '💰 Minhas Finanças',
  description: 'Sistema de gestão financeira pessoal',
  manifest: '/manifest.json',
};

// Separar viewport e themeColor
export const viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang='pt-BR'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
