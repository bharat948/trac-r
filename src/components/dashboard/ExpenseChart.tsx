import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useExpenseStore } from '../../context/ExpenseContext';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/dateHelpers';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

interface ExpenseChartProps {
  selectedMonth: number;
  selectedYear: number;
}

export default function ExpenseChart({
  selectedMonth,
  selectedYear,
}: ExpenseChartProps) {
  const { expenses, preferences } = useExpenseStore();
  
  const chartData = useMemo(() => {
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
    const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return days.map(day => {
      const dayExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return (
          expenseDate.getDate() === day.getDate() &&
          expenseDate.getMonth() === day.getMonth() &&
          expenseDate.getFullYear() === day.getFullYear()
        );
      });
      
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        date: format(day, 'MMM dd'),
        amount: total,
      };
    });
  }, [expenses, selectedMonth, selectedYear]);
  
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Expenses Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: number | undefined) => 
              value ? formatCurrency(value, preferences.currency) : ''
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Expenses"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

