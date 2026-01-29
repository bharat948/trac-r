'use client';

import { useState } from 'react';
import type { Tracker, TrackerTemplate, Frequency } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';

interface TrackerFormProps {
  template?: TrackerTemplate;
  tracker?: Tracker;
  onSubmit: (tracker: Omit<Tracker, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const frequencies: Frequency[] = ['daily', 'weekly', 'monthly', 'quarterly', 'seasonal', 'yearly', 'custom'];

export default function TrackerForm({
  template,
  tracker,
  onSubmit,
  onCancel,
}: TrackerFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: tracker?.name || template?.name || '',
    frequency: tracker?.frequency || template?.frequency || 'monthly',
    category: tracker?.category || template?.category || '',
    budgetLimit: tracker?.budgetLimit?.toString() || '',
    color: tracker?.color || template?.color || '#3B82F6',
    icon: tracker?.icon || template?.icon || 'tag',
    customFields: tracker?.customFields || template?.suggestedFields || [],
    isActive: tracker?.isActive ?? true,
  });

  const [newField, setNewField] = useState('');

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a tracker name');
      return;
    }

    onSubmit({
      name: formData.name,
      frequency: formData.frequency,
      category: formData.category || 'General',
      budgetLimit: formData.budgetLimit ? parseFloat(formData.budgetLimit) : undefined,
      color: formData.color,
      icon: formData.icon,
      customFields: formData.customFields,
      isActive: formData.isActive,
    });
  };

  const addCustomField = () => {
    if (newField.trim() && !formData.customFields.includes(newField.trim())) {
      setFormData({
        ...formData,
        customFields: [...formData.customFields, newField.trim()],
      });
      setNewField('');
    }
  };

  const removeCustomField = (field: string) => {
    setFormData({
      ...formData,
      customFields: formData.customFields.filter(f => f !== field),
    });
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <Input
                label="Tracker Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Daily Meals"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Frequency })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Food, Bills, Shopping"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => setStep(2)}>
              Next
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4">Budget & Customization</h3>
            <div className="space-y-4">
              <Input
                label="Budget Limit (optional)"
                type="number"
                value={formData.budgetLimit}
                onChange={(e) => setFormData({ ...formData, budgetLimit: e.target.value })}
                placeholder="e.g., 5000"
                helperText="Set a monthly budget limit for this tracker"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-12 rounded-lg cursor-pointer"
                />
              </div>
              <Input
                label="Icon Name"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., utensils, car, home"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)}>
              Next
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  placeholder="Add custom field (e.g., meal_type)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomField();
                    }
                  }}
                />
                <Button onClick={addCustomField}>Add</Button>
              </div>
              {formData.customFields.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Custom Fields:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.customFields.map((field) => (
                      <span
                        key={field}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {field}
                        <button
                          onClick={() => removeCustomField(field)}
                          className="hover:text-primary-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={handleSubmit}>
              Create Tracker
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

