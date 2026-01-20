'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieLabelRenderProps } from 'recharts/types/polar/Pie';

const data = [
  { name: 'Suits & Blazers', value: 35, color: '#F59E0B' },
  { name: 'Shirts', value: 25, color: '#10B981' },
  { name: 'Trousers', value: 20, color: '#3B82F6' },
  { name: 'Accessories', value: 12, color: '#8B5CF6' },
  { name: 'Shoes', value: 8, color: '#EC4899' },
];

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

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
        <p className="font-medium text-white">{payload[0].name}</p>
        <p className="text-yellow-300">{payload[0].value}% of total sales</p>
      </div>
    );
  }
  return null;
};


const renderLabel = (props: PieLabelRenderProps) => {
  const name = props.name ?? '';
  const percent = props.percent ?? 0;
  return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export function SalesCategoryChart() {
  return (
    <div className="aspect-4/3 min-h-65 sm:aspect-5/3 md:aspect-video lg:aspect-5/3 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              color: '#D1D5DB', 
              fontSize: '12px',
              padding: '10px 0'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}