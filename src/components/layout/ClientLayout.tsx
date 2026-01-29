'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Modal from '@/components/common/Modal';
import ExpenseEntry from '@/components/trackers/ExpenseEntry';
import { addExpense } from '@/app/actions/expenses';

import { useRouter } from 'next/navigation';

export default function ClientLayout({
    children,
    trackers,
}: {
    children: React.ReactNode;
    trackers: any[];
}) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    const handleQuickAdd = async (expense: any) => {
        await addExpense(expense);
        setIsQuickAddOpen(false);
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                onQuickAdd={() => setIsQuickAddOpen(true)}
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="flex relative">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 p-4 sm:p-6 lg:ml-0 w-full min-w-0">
                    {children}
                </main>
            </div>

            <Modal
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
                title="Quick Add Expense"
                size="lg"
            >
                <ExpenseEntry
                    onSubmit={handleQuickAdd}
                    onCancel={() => setIsQuickAddOpen(false)}
                    trackers={trackers}
                />
            </Modal>
        </div>
    );
}
