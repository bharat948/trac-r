import { Edit, Trash2, Plus } from 'lucide-react';
import type { Tracker } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { getTrackerMonthExpenses } from '../../utils/calculations';
import { useExpenseStore } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/dateHelpers';

interface TrackerCardProps {
  tracker: Tracker;
  onEdit: (tracker: Tracker) => void;
  onDelete: (id: string) => void;
  onAddExpense: (trackerId: string) => void;
}

export default function TrackerCard({
  tracker,
  onEdit,
  onDelete,
  onAddExpense,
}: TrackerCardProps) {
  const { expenses, preferences } = useExpenseStore();
  const monthExpenses = getTrackerMonthExpenses(tracker.id, expenses);
  
  // Calculate budget progress based on current month expenses only
  const progress = tracker.budgetLimit 
    ? (monthExpenses / tracker.budgetLimit) * 100 
    : 0;
  
  const getIcon = (iconName: string) => {
    // In a real app, you'd map icon names to actual icons
    // For now, we'll use a simple emoji or letter
    return iconName.charAt(0).toUpperCase();
  };
  
  return (
    <Card hover className="relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: tracker.color }}
          >
            {getIcon(tracker.icon)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tracker.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{tracker.frequency}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(tracker)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Edit tracker"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(tracker.id)}
            className="p-2 rounded-lg hover:bg-danger-50 transition-colors"
            aria-label="Delete tracker"
          >
            <Trash2 className="w-4 h-4 text-danger-500" />
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">This Month</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(monthExpenses, preferences.currency)}
          </span>
        </div>
        {tracker.budgetLimit && (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Budget</span>
              <span className="text-xs text-gray-500">
                {formatCurrency(tracker.budgetLimit, preferences.currency)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  progress > 100
                    ? 'bg-danger-500'
                    : progress > 80
                    ? 'bg-warning-500'
                    : 'bg-success-500'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">
                {progress.toFixed(1)}% used
              </span>
              {progress > 100 && (
                <span className="text-xs text-danger-500">Over budget!</span>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Actions */}
      <Button
        onClick={() => onAddExpense(tracker.id)}
        variant="primary"
        size="sm"
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Expense
      </Button>
    </Card>
  );
}

