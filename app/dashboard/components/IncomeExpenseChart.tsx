'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', income: 120000, expenses: 45000 },
  { month: 'Feb', income: 98000, expenses: 42000 },
  { month: 'Mar', income: 145000, expenses: 48000 },
  { month: 'Apr', income: 132000, expenses: 46000 },
  { month: 'May', income: 158000, expenses: 52000 },
  { month: 'Jun', income: 165000, expenses: 55000 },
  { month: 'Jul', income: 142000, expenses: 49000 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: Record<string, number | string>;
    dataKey: string;
    value: number;
    color: string;
    name: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const income = payload.find(p => p.dataKey === 'income')?.value ?? 0;
    const expenses = payload.find(p => p.dataKey === 'expenses')?.value ?? 0;

    return (
      <div className="bg-gray-900 border p-3 rounded-lg shadow-lg">
        <p className="text-white font-medium">{label}</p>
        <p className="text-green-400">Income: NGN {income.toLocaleString()}</p>
        <p className="text-red-400">Expenses: NGN {expenses.toLocaleString()}</p>
        <p className="text-green-400">
          Net: NGN {(income - expenses).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function IncomeExpenseChart() {
  return (
    <div className="aspect-4/3 min-h-65 sm:aspect-5/3 md:aspect-video lg:aspect-5/3 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value: number) => `NGN ${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="income"
            fill="#10B981"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            fill="#EF4444"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
