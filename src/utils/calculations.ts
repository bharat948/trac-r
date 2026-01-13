import type { Expense, Tracker, MonthlyReport } from '../types';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

// Monthly total calculation
export function calculateMonthlyTotal(expenses: Expense[], month: number, year: number): number {
  return expenses
    .filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

// Tracker-wise breakdown
export function getTrackerBreakdown(expenses: Expense[], trackers: Tracker[]): {
  trackerId: string;
  trackerName: string;
  total: number;
  count: number;
  color: string;
}[] {
  return trackers
    .filter(t => t.isActive)
    .map(tracker => ({
      trackerId: tracker.id,
      trackerName: tracker.name,
      total: expenses
        .filter(e => e.trackerId === tracker.id)
        .reduce((sum, e) => sum + e.amount, 0),
      count: expenses.filter(e => e.trackerId === tracker.id).length,
      color: tracker.color,
    }));
}

// Budget progress
export function getBudgetProgress(tracker: Tracker, expenses: Expense[]): number {
  if (!tracker.budgetLimit) return 0;
  const spent = expenses
    .filter(e => e.trackerId === tracker.id)
    .reduce((sum, e) => sum + e.amount, 0);
  return (spent / tracker.budgetLimit) * 100;
}

// Category breakdown
export function getCategoryBreakdown(expenses: Expense[]): { category: string; total: number }[] {
  const categoryMap = new Map<string, number>();
  
  expenses.forEach(expense => {
    const category = expense.category || 'Uncategorized';
    const current = categoryMap.get(category) || 0;
    categoryMap.set(category, current + expense.amount);
  });
  
  return Array.from(categoryMap.entries()).map(([category, total]) => ({
    category,
    total,
  }));
}

// Generate monthly report
export function generateMonthlyReport(
  expenses: Expense[],
  trackers: Tracker[],
  month: number,
  year: number
): MonthlyReport {
  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  return {
    month: new Date(year, month).toLocaleString('default', { month: 'long' }),
    year,
    totalExpenses: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    byTracker: getTrackerBreakdown(monthExpenses, trackers),
    byCategory: getCategoryBreakdown(monthExpenses),
  };
}

// Today's expenses
export function getTodayExpenses(expenses: Expense[]): number {
  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);
  
  return expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      return isWithinInterval(expenseDate, { start, end });
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

// This week's expenses
export function getWeekExpenses(expenses: Expense[]): number {
  const today = new Date();
  const start = startOfWeek(today);
  const end = endOfWeek(today);
  
  return expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      return isWithinInterval(expenseDate, { start, end });
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

// This month's expenses
export function getMonthExpenses(expenses: Expense[]): number {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  
  return expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      return isWithinInterval(expenseDate, { start, end });
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

// Get expenses for a specific tracker in current month
export function getTrackerMonthExpenses(trackerId: string, expenses: Expense[]): number {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  
  return expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      return e.trackerId === trackerId && isWithinInterval(expenseDate, { start, end });
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

