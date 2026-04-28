'use client';

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
  return (
    <section className="em-card-hard bg-white p-5">
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-[var(--em-ink)]">Engajamento mensal por atividade</h2>
        <p className="mt-1 text-sm text-[var(--em-text-soft)]">Veja quais propostas recebem mais envios e quais estão com menor adesão.</p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={10}>
            <CartesianGrid strokeDasharray="4 4" stroke="#d8d5ca" vertical={false} />
            <XAxis dataKey="month" stroke="#6f7279" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} stroke="#6f7279" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #0E0F12',
                borderRadius: 16,
                color: '#0E0F12',
                boxShadow: '4px 4px 0 0 #0E0F12',
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#4A4D55' }} />
            {series.map((item) => (
              <Bar key={item.key} dataKey={item.key} name={item.label} fill={item.color} radius={[10, 10, 0, 0]} maxBarSize={28} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
