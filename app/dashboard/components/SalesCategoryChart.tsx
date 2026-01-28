'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: typeof data[0];
    dataKey: string;
    value: number;
    color: string;
    name: string;
  }>;
}

const data = [
  { name: 'Suits & Blazers', value: 35, color: '#F59E0B' },
  { name: 'Shirts', value: 25, color: '#10B981' },
  { name: 'Trousers', value: 20, color: '#3B82F6' },
  { name: 'Accessories', value: 12, color: '#8B5CF6' },
  { name: 'Shoes', value: 8, color: '#EC4899' },
];

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
        <p className="font-medium text-white">{payload[0].name}</p>
        <p className="text-green-400">{payload[0].value}% of total sales</p>
      </div>
    );
  }
  return null;
};

export function SalesCategoryChart() {
  return (
    <div className="w-full h-75 sm:h-87.5 md:h-100 lg:h-112.5">
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              color: '#D1D5DB',
              fontSize: '12px',
              paddingTop: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
