import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useExpenseStore } from '../../context/ExpenseContext';
import Card from '../common/Card';
import { getTrackerBreakdown } from '../../utils/calculations';
import { formatCurrency } from '../../utils/dateHelpers';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface TrackerSummaryProps {
  selectedMonth: number;
  selectedYear: number;
}

export default function TrackerSummary({
  selectedMonth,
  selectedYear,
}: TrackerSummaryProps) {
  const { expenses, trackers, preferences } = useExpenseStore();
  
  const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
  const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));
  
  const monthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });
  
  const breakdown = getTrackerBreakdown(monthExpenses, trackers);
  
  const chartData = breakdown.map(item => ({
    name: item.trackerName,
    value: item.total,
    color: item.color,
  }));
  
  const COLORS = breakdown.map(item => item.color);
  
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Expenses by Tracker</h3>
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) => 
                  value ? formatCurrency(value, preferences.currency) : ''
                }
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div key={item.trackerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-900">{item.trackerName}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(item.total, preferences.currency)}
                  </p>
                  <p className="text-xs text-gray-500">{item.count} expenses</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No expenses for this month
        </div>
      )}
    </Card>
  );
}

