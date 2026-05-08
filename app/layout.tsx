import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { FirebaseProvider } from '@/components/FirebaseProvider';

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
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-stone-50 text-stone-900">
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
