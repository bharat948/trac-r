import { useExpenseStore } from '../../context/ExpenseContext';
import Card from '../common/Card';
import { getTodayExpenses, getWeekExpenses, getMonthExpenses, calculateMonthlyTotal } from '../../utils/calculations';
import { formatCurrency } from '../../utils/dateHelpers';

interface MonthlyOverviewProps {
  selectedMonth: number;
  selectedYear: number;
}

export default function MonthlyOverview({
  selectedMonth,
  selectedYear,
}: MonthlyOverviewProps) {
  const { expenses, preferences } = useExpenseStore();
  const monthlyTotal = calculateMonthlyTotal(expenses, selectedMonth, selectedYear);
  const todayExpenses = getTodayExpenses(expenses);
  const weekExpenses = getWeekExpenses(expenses);
  const monthExpenses = getMonthExpenses(expenses);
  
  const stats = [
    {
      label: 'Today',
      value: formatCurrency(todayExpenses, preferences.currency),
      color: 'text-primary-600',
    },
    {
      label: 'This Week',
      value: formatCurrency(weekExpenses, preferences.currency),
      color: 'text-success-600',
    },
    {
      label: 'This Month',
      value: formatCurrency(monthExpenses, preferences.currency),
      color: 'text-warning-600',
    },
    {
      label: 'Selected Month',
      value: formatCurrency(monthlyTotal, preferences.currency),
      color: 'text-gray-900',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} padding="md">
          <div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

