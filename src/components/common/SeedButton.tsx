'use client';

import { useState } from 'react';
import { seedDatabase } from '@/app/actions/seed';
import Button from './Button';

export default function SeedButton() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSeed = async () => {
        if (!confirm('Add dummy data to database?')) return;

        setLoading(true);
        setMsg('');
        try {
            const res = await seedDatabase();
            if (res.success) {
                setMsg('Data added! Refreshing...');
                window.location.reload();
            } else {
                setMsg('Error: ' + res.error);
            }
        } catch (err) {
            setMsg('Failed to seed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleSeed}
                disabled={loading}
                variant="outline"
                className="text-xs"
            >
                {loading ? 'Adding...' : 'Add Dummy Data'}
            </Button>
            {msg && <span className="text-xs text-green-600 font-medium">{msg}</span>}
        </div>
    );
}
