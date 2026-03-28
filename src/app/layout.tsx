import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import './globals.css';
import { CookieBanner } from '@/components/legal/cookie-banner';
import { AuthProvider } from '@/components/providers/session-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';

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

const themeInitScript = `
  (function () {
    try {
      var storedTheme = window.localStorage.getItem('escreva_mais_theme');
      var theme = storedTheme === 'light' || storedTheme === 'dark'
        ? storedTheme
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.style.colorScheme = 'light';
    }
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <AuthProvider>
            <div className="theme-root min-h-screen">
              {children}
              <ThemeToggle />
              <CookieBanner />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
