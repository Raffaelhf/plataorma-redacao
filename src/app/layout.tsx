import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import './globals.css';
import { CookieBanner } from '@/components/legal/cookie-banner';
import { AuthProvider } from '@/components/providers/session-provider';

const bodyFont = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
});

const displayFont = Sora({
  variable: '--font-display',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Escreva Mais',
  description: 'Plataforma de redação com prática, correção personalizada e acompanhamento de desempenho.',
  icons: {
    icon: '/landing/favicon.svg',
    shortcut: '/landing/favicon.svg',
    apple: '/landing/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <div className="theme-root min-h-screen">
            {children}
            <CookieBanner />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
