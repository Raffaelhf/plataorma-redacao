'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed right-4 top-20 z-20 lg:top-4 lg:z-[140]">
      <div className="flex items-center gap-1 rounded-full border border-[rgba(217,222,248,0.84)] bg-[rgba(255,255,255,0.86)] p-1 shadow-[0_18px_40px_rgba(28,34,108,0.14)] backdrop-blur-xl transition-colors dark:border-slate-700/70 dark:bg-slate-950/72 dark:shadow-[0_20px_44px_rgba(0,0,0,0.34)]">
        <button
          type="button"
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b49dd]',
            theme === 'light'
              ? 'bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_100%)] text-[#22347e] shadow-[0_10px_24px_rgba(74,73,140,0.14)]'
              : 'text-[#6777a8] hover:bg-white/70 hover:text-[#22347e] dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-slate-50',
          )}
        >
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">Light</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          aria-pressed={theme === 'dark'}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b49dd]',
            theme === 'dark'
              ? 'bg-[linear-gradient(135deg,#0f172a_0%,#1f2937_100%)] text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)]'
              : 'text-[#6777a8] hover:bg-white/70 hover:text-[#22347e] dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-slate-50',
          )}
        >
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Dark</span>
        </button>
      </div>
    </div>
  );
}
