'use server';

import connectDB from '@/lib/mongodb';
import Tracker from '@/models/Tracker';
import Expense from '@/models/Expense';
import { revalidatePath } from 'next/cache';

const DUMMY_TRACKERS = [
    {
        name: 'Personal Expenses',
        category: 'Personal',
        frequency: 'Monthly',
        budgetLimit: 20000,
        color: '#3B82F6',
        icon: '👤',
        isActive: true,
    },
    {
        name: 'Groceries',
        category: 'Food',
        frequency: 'Weekly',
        budgetLimit: 5000,
        color: '#10B981',
        icon: '🛒',
        customFields: ['Store', 'Items'],
        isActive: true,
    },
    {
        name: 'Office Commute',
        category: 'Transport',
        frequency: 'Daily',
        budgetLimit: 3000,
        color: '#F59E0B',
        icon: '🚗',
        isActive: true,
    }
];

const DUMMY_EXPENSES_GENERATOR = (trackerIds: string[]) => {
    const expenses = [];
    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health'];
    const methods = ['Cash', 'Credit Card', 'UPI', 'Debit Card'];
    const descriptions = ['Morning Coffee', 'Uber to work', 'Lunch with colleagues', 'Netflix Subscription', 'Gym Membership', 'Grocery Run'];

    for (let i = 0; i < 10; i++) {
        const randomTrackerId = trackerIds[Math.floor(Math.random() * trackerIds.length)];
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days

        expenses.push({
            trackerId: randomTrackerId,
            amount: Math.floor(Math.random() * 2000) + 50,
            date: randomDate,
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            paymentMethod: methods[Math.floor(Math.random() * methods.length)],
            tags: ['dummy', 'test'],
        });
    }
    return expenses;
};

export async function seedDatabase() {
    try {
        await connectDB();

        // Clear existing dump data if needed? No, let's just append for now to be safe, or we can check if empty.
        // For this request: "add dummy data". So appending is fine.

        const createdTrackers = [];

        for (const trackerData of DUMMY_TRACKERS) {
            // Check if exists to avoid dupes
            let tracker = await Tracker.findOne({ name: trackerData.name });
            if (!tracker) {
                tracker = await Tracker.create(trackerData);
            }
            createdTrackers.push(tracker._id);
        }

        const expenses = DUMMY_EXPENSES_GENERATOR(createdTrackers);
        await Expense.insertMany(expenses);

        revalidatePath('/');
        revalidatePath('/trackers');
        revalidatePath('/history');

        return { success: true, message: `Added ${DUMMY_TRACKERS.length} trackers (if new) and ${expenses.length} expenses.` };
    } catch (error: any) {
        console.error('Seeding error:', error);
        return { success: false, error: error.message };
    }
}
