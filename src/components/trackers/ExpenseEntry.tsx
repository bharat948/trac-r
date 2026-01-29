'use client';

import { useState } from 'react';
import type { Expense } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';

interface ExpenseEntryProps {
  trackerId?: string;
  expense?: any;
  onSubmit: (expense: any) => void;
  onCancel: () => void;
  trackers: any[];
}

export default function ExpenseEntry({
  trackerId,
  expense,
  onSubmit,
  onCancel,
  trackers,
}: ExpenseEntryProps) {
  const selectedTracker = trackers.find((t: any) => (t._id || t.id) === (trackerId || expense?.trackerId));

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    trackerId: trackerId || expense?.trackerId || '',
    amount: expense?.amount.toString() || '',
    date: expense?.date
      ? formatDateForInput(expense.date)
      : formatDateForInput(new Date()),
    description: expense?.description || '',
    category: expense?.category || selectedTracker?.category || '',
    paymentMethod: expense?.paymentMethod || '',
    tags: expense?.tags?.join(', ') || '',
    customFieldValues: expense?.customFieldValues || {},
  });

  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>(
    expense?.customFieldValues || {}
  );

  const handleSubmit = () => {
    if (!formData.trackerId) {
      alert('Please select a tracker');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }

    onSubmit({
      trackerId: formData.trackerId,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
      description: formData.description,
      category: formData.category || undefined,
      paymentMethod: formData.paymentMethod || undefined,
      tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
      customFieldValues: Object.keys(customFieldValues).length > 0 ? customFieldValues : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tracker
        </label>
        <select
          value={formData.trackerId}
          onChange={(e) => {
            const tracker = trackers.find((t: any) => (t._id || t.id) === e.target.value);
            setFormData({
              ...formData,
              trackerId: e.target.value,
              category: tracker?.category || formData.category,
            });
            setCustomFieldValues({});
          }}
          disabled={!!trackerId || !!expense}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select a tracker</option>
          {trackers.filter((t: any) => t.isActive).map((tracker: any) => (
            <option key={tracker._id || tracker.id} value={tracker._id || tracker.id}>
              {tracker.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Amount"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
        placeholder="0.00"
      />

      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />

      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        placeholder="What is this expense for?"
      />

      <Input
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        placeholder="Optional"
      />

      <Input
        label="Payment Method"
        value={formData.paymentMethod}
        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
        placeholder="e.g., Cash, Card, UPI"
      />

      <Input
        label="Tags (comma separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="e.g., urgent, business, personal"
      />

      {/* Custom Fields */}
      {selectedTracker && selectedTracker.customFields.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Custom Fields
          </label>
          {selectedTracker.customFields.map((field: string) => (
            <Input
              key={field}
              label={field.replace('_', ' ')}
              value={customFieldValues[field] || ''}
              onChange={(e) =>
                setCustomFieldValues({
                  ...customFieldValues,
                  [field]: e.target.value,
                })
              }
            />
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {expense ? 'Update' : 'Add'} Expense
        </Button>
      </div>
    </div>
  );
}

