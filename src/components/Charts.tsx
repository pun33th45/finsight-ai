import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Category, TrendDataPoint, CategoryDataPoint } from '../types';

const COLORS = [
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#f43f5e',
  '#0ea5e9',
  '#94a3b8',
];

const CATEGORY_COLORS: Record<string, string> = {
  [Category.FOOD]: '#6366f1',
  [Category.RENT]: '#ec4899',
  [Category.TRAVEL]: '#f59e0b',
  [Category.UTILITIES]: '#10b981',
  [Category.SUBSCRIPTIONS]: '#8b5cf6',
  [Category.SHOPPING]: '#f43f5e',
  [Category.ENTERTAINMENT]: '#0ea5e9',
  [Category.OTHER]: '#94a3b8',
};

/**
 * Safe formatter for Recharts (handles undefined & arrays)
 */
const formatCurrency = (v?: ValueType): string => {
  if (v == null) return '';

  if (Array.isArray(v)) {
    const first = v[0];
    if (typeof first !== 'number') return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(first);
  }

  if (typeof v !== 'number') return '';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(v);
};

export const IndividualCategoryDonut: React.FC<{ data: CategoryDataPoint }> = ({ data }) => {
  const innerData = data.transactions.map((t) => ({
    name: t.description,
    value: t.amount,
  }));

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
        {data.name}
      </h4>

      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={innerData}
              innerRadius={30}
              outerRadius={45}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {innerData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CATEGORY_COLORS[data.name] || '#94a3b8'}
                  fillOpacity={1 - i * 0.15}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(v) => formatCurrency(v)}
              contentStyle={{ borderRadius: '8px', fontSize: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-1 text-lg font-bold text-gray-800">
        {formatCurrency(data.value)}
      </p>
    </div>
  );
};

export const CategoryGrid: React.FC<{ data: CategoryDataPoint[] }> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 italic">
        No category data yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((cat) => (
        <IndividualCategoryDonut key={cat.name} data={cat} />
      ))}
    </div>
  );
};

export const SpendingTrend: React.FC<{ data: TrendDataPoint[] }> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-300">
        No data for trend.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v)}
          />

          <Tooltip
            formatter={(v) => [formatCurrency(v), 'Total Spend']}
          />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
