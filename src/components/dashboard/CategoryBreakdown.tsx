'use client';

import Card from '../common/Card';
import { getCategoryBreakdown } from '../../utils/calculations';
import { formatCurrency } from '../../utils/dateHelpers';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryBreakdownProps {
  selectedMonth: number;
  selectedYear: number;
  expenses: any[];
}

export default function CategoryBreakdown({
  selectedMonth,
  selectedYear,
  expenses,
}: CategoryBreakdownProps) {
  const preferences = { currency: 'INR' }; // Temporary

  const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
  const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));

  const monthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });

  const breakdown = getCategoryBreakdown(monthExpenses);

  const chartData = breakdown.map(item => ({
    category: item.category,
    amount: item.total,
  }));

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(value: number | undefined) =>
                value ? formatCurrency(value, preferences.currency) : ''
              }
            />
            <Legend />
            <Bar dataKey="amount" fill="#3B82F6" name="Amount" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No expenses for this month
        </div>
      )}
    </Card>
  );
}

