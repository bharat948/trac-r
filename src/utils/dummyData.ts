import type { TrackerTemplate } from '../types';

// Pre-built templates
export const templates: TrackerTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Daily Food Expenses',
    category: 'Food',
    frequency: 'daily',
    suggestedFields: ['meal_type', 'location'],
    icon: 'utensils',
    color: '#10B981',
  },
  {
    id: 'tpl-2',
    name: 'Monthly Bills',
    category: 'Bills',
    frequency: 'monthly',
    suggestedFields: ['bill_type', 'due_date'],
    icon: 'receipt',
    color: '#3B82F6',
  },
  {
    id: 'tpl-3',
    name: 'Farm Labor Expenses',
    category: 'Agriculture',
    frequency: 'seasonal',
    suggestedFields: ['worker_name', 'task', 'season'],
    icon: 'tractor',
    color: '#F59E0B',
  },
  {
    id: 'tpl-4',
    name: 'Shopping',
    category: 'Shopping',
    frequency: 'weekly',
    suggestedFields: [],
    icon: 'shopping-bag',
    color: '#EC4899',
  },
  {
    id: 'tpl-5',
    name: 'Transportation',
    category: 'Transport',
    frequency: 'daily',
    suggestedFields: ['vehicle_type', 'distance'],
    icon: 'car',
    color: '#8B5CF6',
  },
];

// No dummy trackers or expenses - app starts fresh for real-time testing

