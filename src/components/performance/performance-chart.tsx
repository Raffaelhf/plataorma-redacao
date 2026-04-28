'use client';

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '../ui/card';

type Point = { label: string; score: number };

export function PerformanceChart({ data }: { data: Point[] }) {
  return (
    <Card className="h-72 bg-white sm:h-80">
      <p className="mb-4 text-lg font-extrabold text-[var(--em-ink)]">Evolução</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#d8d5ca" />
          <XAxis dataKey="label" stroke="#6f7279" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 1000]} stroke="#6f7279" />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1.5px solid #0E0F12', color: '#0E0F12', borderRadius: 16, boxShadow: '4px 4px 0 0 #0E0F12' }}
            formatter={(val?: number) => `${val ?? 0}/1000`}
          />
          <Line type="monotone" dataKey="score" stroke="#16A35F" strokeWidth={3} dot={{ strokeWidth: 2, fill: '#FFC93D' }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
