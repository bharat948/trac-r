import { getTrackers } from '@/app/actions/trackers';
import { getExpenses } from '@/app/actions/expenses';
import DashboardClient from '@/components/dashboard/DashboardClient';
import SeedButton from '@/components/common/SeedButton';

export default async function DashboardPage() {
    const trackers = await getTrackers();
    const expenses = await getExpenses();

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex gap-2">
                        <SeedButton />
                    </div>
                </div>
                <DashboardClient initialTrackers={trackers} initialExpenses={expenses} />
            </div>
        </main>
    );
}
