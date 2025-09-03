import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '💰 Minhas Finanças',
  description: 'Sistema de gestão financeira pessoal',
};

export default function RootLayout({ children }) {
  return (
    <html lang='pt-PT'>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
