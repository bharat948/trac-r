import { useState } from 'react';
import MonthlyOverview from '../components/dashboard/MonthlyOverview';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import TrackerSummary from '../components/dashboard/TrackerSummary';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';

export default function Dashboard() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your expenses</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Overview Cards */}
      <MonthlyOverview selectedMonth={selectedMonth} selectedYear={selectedYear} />
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart selectedMonth={selectedMonth} selectedYear={selectedYear} />
        <CategoryBreakdown selectedMonth={selectedMonth} selectedYear={selectedYear} />
      </div>
      
      {/* Tracker Summary */}
      <TrackerSummary selectedMonth={selectedMonth} selectedYear={selectedYear} />
    </div>
  );
}

