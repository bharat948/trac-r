import CreateTrackerClient from '@/components/trackers/CreateTrackerClient';
import { useExpenseStore } from '@/context/ExpenseContext';

export default function CreateTrackerPage() {
    // We might need to get templates from a server action if they are not static
    // For now, let's assume they are available in a shared utility or just hardcoded if they were in context

    return <CreateTrackerClient />;
}
