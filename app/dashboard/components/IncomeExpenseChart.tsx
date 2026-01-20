'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

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
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
        <p className="text-white font-medium">{label}</p>
        <p className="text-green-400">Income: ${payload[0].value?.toLocaleString()}</p>
        <p className="text-red-400">Expenses: ${payload[1].value?.toLocaleString()}</p>
        <p className="text-yellow-300">
          Net: ${((payload[0].value ?? 0) - (payload[1].value ?? 0)).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function IncomeExpenseChart() {
  return (
    <div className="aspect-4/3 min-h-65 sm:aspect-5/3 md:aspect-video  lg:aspect-5/3 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10B981" 
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#EF4444" 
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}