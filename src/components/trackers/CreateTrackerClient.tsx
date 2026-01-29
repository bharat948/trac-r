'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TrackerForm from '@/components/trackers/TrackerForm';
import TemplateSelector from '@/components/trackers/TemplateSelector';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
// import { useToast } from '@/components/common/Toast';
import { createTracker } from '@/app/actions/trackers';
import { templates } from '@/utils/dummyData';

export default function CreateTrackerClient() {
    const router = useRouter();
    // const { showToast } = useToast();
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [step, setStep] = useState<'template' | 'form'>('template');

    const handleTemplateSelect = (template: any) => {
        setSelectedTemplate(template);
        setStep('form');
    };

    const handleCreateCustom = () => {
        setSelectedTemplate(null);
        setStep('form');
    };

    const handleSubmit = async (trackerData: any) => {
        await createTracker(trackerData);
        // showToast('Tracker created successfully', 'success');
        router.push('/trackers');
        router.refresh();
    };

    const handleBack = () => {
        if (step === 'form') {
            setStep('template');
            setSelectedTemplate(null);
        } else {
            router.push('/trackers');
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-lg font-semibold">Choose a Template</h2>
                        <Button
                            variant="outline"
                            onClick={handleCreateCustom}
                            className="w-full sm:w-auto touch-manipulation"
                        >
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
