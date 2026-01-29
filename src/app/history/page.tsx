import { getExpenses } from '@/app/actions/expenses';
import { getTrackers } from '@/app/actions/trackers';
import ExpenseHistoryClient from '@/components/trackers/ExpenseHistoryClient';

export default async function HistoryPage() {
    const expenses = await getExpenses();
    const trackers = await getTrackers();

    return (
        <ExpenseHistoryClient initialExpenses={expenses} initialTrackers={trackers} />
    );
}
