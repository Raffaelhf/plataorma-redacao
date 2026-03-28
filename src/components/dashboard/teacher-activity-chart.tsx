'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ChartRow = {
  month: string;
  [key: string]: string | number;
};

type Series = {
  key: string;
  label: string;
  color: string;
};

export function TeacherActivityChart({
  data,
  series,
}: {
  data: ChartRow[];
  series: Series[];
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)] dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(11,18,32,0.92),rgba(15,23,42,0.86))] dark:shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#22347e] dark:text-slate-100">Engajamento mensal por atividade</h2>
        <p className="mt-1 text-sm text-[#6d79a5] dark:text-slate-300">Veja quais propostas recebem mais envios e quais estão com menor adesão.</p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={10}>
            <CartesianGrid strokeDasharray="4 4" stroke={isDark ? '#334155' : '#e3e8fb'} vertical={false} />
            <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#7b86ae'} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} stroke={isDark ? '#94a3b8' : '#7b86ae'} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: isDark ? '1px solid #334155' : '1px solid #dce3fb',
                borderRadius: 16,
                color: isDark ? '#e2e8f0' : '#22347e',
                boxShadow: isDark ? '0 18px 36px rgba(0,0,0,0.24)' : '0 18px 36px rgba(74,73,140,0.12)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#52618f' }} />
            {series.map((item) => (
              <Bar key={item.key} dataKey={item.key} name={item.label} fill={item.color} radius={[10, 10, 0, 0]} maxBarSize={28} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
