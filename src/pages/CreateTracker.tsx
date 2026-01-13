import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenseStore } from '../context/ExpenseContext';
import TrackerForm from '../components/trackers/TrackerForm';
import TemplateSelector from '../components/trackers/TemplateSelector';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import type { Tracker, TrackerTemplate } from '../types';

export default function CreateTracker() {
  const navigate = useNavigate();
  const { templates, addTracker } = useExpenseStore();
  const { showToast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<TrackerTemplate | null>(null);
  const [step, setStep] = useState<'template' | 'form'>('template');
  
  const handleTemplateSelect = (template: TrackerTemplate) => {
    setSelectedTemplate(template);
    setStep('form');
  };
  
  const handleCreateCustom = () => {
    setSelectedTemplate(null);
    setStep('form');
  };
  
  const handleSubmit = (trackerData: Omit<Tracker, 'id' | 'createdAt'>) => {
    const newTracker: Tracker = {
      ...trackerData,
      id: `tr-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      createdAt: new Date(),
    };
    
    addTracker(newTracker);
    showToast('Tracker created successfully', 'success');
    navigate('/trackers');
  };
  
  const handleBack = () => {
    if (step === 'form') {
      setStep('template');
      setSelectedTemplate(null);
    } else {
      navigate('/trackers');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Tracker</h1>
        <p className="text-gray-600 mt-1">
          {step === 'template'
            ? 'Choose a template or create a custom tracker'
            : 'Configure your tracker settings'}
        </p>
      </div>
      
      {step === 'template' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Choose a Template</h2>
            <Button variant="outline" onClick={handleCreateCustom}>
              Create Custom Tracker
            </Button>
          </div>
          
          <TemplateSelector
            templates={templates}
            onSelect={handleTemplateSelect}
          />
        </div>
      ) : (
        <Card>
          <TrackerForm
            template={selectedTemplate || undefined}
            onSubmit={handleSubmit}
            onCancel={handleBack}
          />
        </Card>
      )}
    </div>
  );
}

