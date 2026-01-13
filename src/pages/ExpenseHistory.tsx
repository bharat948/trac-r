import { useState, useMemo } from 'react';
import { useExpenseStore } from '../context/ExpenseContext';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import ExpenseEntry from '../components/trackers/ExpenseEntry';
import { useToast } from '../components/common/Toast';
import type { Expense } from '../types';
import { formatDate, formatCurrency } from '../utils/dateHelpers';
import { Edit, Trash2 } from 'lucide-react';

export default function ExpenseHistory() {
  const { expenses, trackers, updateExpense, deleteExpense, preferences } = useExpenseStore();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracker, setSelectedTracker] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];
    
    // Search
    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Tracker filter
    if (selectedTracker) {
      filtered = filtered.filter(e => e.trackerId === selectedTracker);
    }
    
    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(e => new Date(e.date) >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(e => new Date(e.date) <= toDate);
    }
    
    // Amount filter
    if (amountMin) {
      const min = parseFloat(amountMin);
      filtered = filtered.filter(e => e.amount >= min);
    }
    if (amountMax) {
      const max = parseFloat(amountMax);
      filtered = filtered.filter(e => e.amount <= max);
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchQuery, selectedTracker, dateFrom, dateTo, amountMin, amountMax]);
  
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };
  
  const handleUpdate = (expenseData: Omit<Expense, 'id'>) => {
    if (selectedExpense) {
      updateExpense(selectedExpense.id, expenseData);
      showToast('Expense updated successfully', 'success');
      setIsEditModalOpen(false);
      setSelectedExpense(null);
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
      showToast('Expense deleted successfully', 'success');
    }
  };
  
  const getTrackerName = (trackerId: string) => {
    return trackers.find(t => t.id === trackerId)?.name || 'Unknown';
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Expense History</h1>
        <p className="text-gray-600 mt-1">View and manage all your expenses</p>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base touch-manipulation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracker
            </label>
            <select
              value={selectedTracker}
              onChange={(e) => setSelectedTracker(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base touch-manipulation"
            >
              <option value="">All Trackers</option>
              {trackers.filter(t => t.isActive).map((tracker) => (
                <option key={tracker.id} value={tracker.id}>
                  {tracker.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base touch-manipulation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base touch-manipulation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Amount
            </label>
            <input
              type="number"
              placeholder="0"
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base touch-manipulation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Amount
            </label>
            <input
              type="number"
              placeholder="0"
              value={amountMax}
              onChange={(e) => setAmountMax(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base touch-manipulation"
            />
          </div>
        </div>
      </Card>
      
      {/* Expenses Table */}
      <Card padding="none">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Tracker
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Category
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{formatDate(expense.date, preferences.dateFormat)}</span>
                        <span className="text-xs text-gray-500 sm:hidden">{getTrackerName(expense.trackerId)}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                      {getTrackerName(expense.trackerId)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {expense.description}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(expense.amount, preferences.currency)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {expense.category || '-'}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 rounded-lg hover:bg-primary-50 active:bg-primary-100 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label="Edit expense"
                        >
                          <Edit className="w-4 h-4 text-primary-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 rounded-lg hover:bg-danger-50 active:bg-danger-100 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label="Delete expense"
                        >
                          <Trash2 className="w-4 h-4 text-danger-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 sm:px-6 py-12 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        }}
        title="Edit Expense"
        size="lg"
      >
        {selectedExpense && (
          <ExpenseEntry
            expense={selectedExpense}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedExpense(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

