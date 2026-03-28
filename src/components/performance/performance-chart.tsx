'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '../ui/card';

type Point = { label: string; score: number };

export function PerformanceChart({ data, light = false }: { data: Point[]; light?: boolean }) {
  const { theme } = useTheme();
  const themedLight = light && theme !== 'dark';

  return (
    <Card
      className={
        themedLight
          ? 'h-72 border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] shadow-[0_20px_50px_rgba(74,73,140,0.1)] sm:h-80'
          : 'h-72 sm:h-80'
      }
    >
      <p className={`mb-4 text-lg font-semibold ${themedLight ? 'text-[#22347e]' : 'text-white dark:text-slate-100'}`}>Evolucao</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke={themedLight ? '#e3e8fb' : '#334155'} />
          <XAxis dataKey="label" stroke={themedLight ? '#7b86ae' : '#94a3b8'} tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 1000]} stroke={themedLight ? '#7b86ae' : '#94a3b8'} />
          <Tooltip
            contentStyle={
              themedLight
                ? { backgroundColor: '#ffffff', border: '1px solid #dce3fb', color: '#22347e', borderRadius: 16, boxShadow: '0 18px 36px rgba(74,73,140,0.12)' }
                : { backgroundColor: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', borderRadius: 16 }
            }
            formatter={(val?: number) => `${val ?? 0}/1000`}
          />
          <Line type="monotone" dataKey="score" stroke={themedLight ? '#5d50d8' : '#818cf8'} strokeWidth={3} dot={{ strokeWidth: 2, fill: themedLight ? '#ff8d34' : '#a5b4fc' }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
