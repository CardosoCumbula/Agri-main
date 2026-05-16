import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { FirebaseProvider } from '@/components/FirebaseProvider';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'AgroMoz - Mercado do Agricultor',
  description: 'Conectando agricultores moçambicanos diretamente ao mercado.',
  openGraph: {
    title: 'AgroMoz - Mercado do Agricultor',
    description: 'Plataforma agrícola moderna para Moçambique',
    url: 'https://agromoz.com',
    type: 'website',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body className="font-sans bg-stone-50 text-stone-900">
        <FirebaseProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
