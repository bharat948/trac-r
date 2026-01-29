'use server';

import connectDB from '@/lib/mongodb';
import Expense, { IExpense } from '@/models/Expense';
import { revalidatePath } from 'next/cache';

export async function getExpenses(trackerId?: string) {
    await connectDB();
    const query = trackerId ? { trackerId } : {};
    const expenses = await Expense.find(query).sort({ date: -1 });
    return JSON.parse(JSON.stringify(expenses));
}

export async function addExpense(formData: any) {
    await connectDB();
    const expense = await Expense.create(formData);
    revalidatePath('/history');
    revalidatePath('/');
    return JSON.parse(JSON.stringify(expense));
}

export async function updateExpense(id: string, formData: any) {
    await connectDB();
    const expense = await Expense.findByIdAndUpdate(id, formData, { new: true });
    revalidatePath('/history');
    return JSON.parse(JSON.stringify(expense));
}

export async function deleteExpense(id: string) {
    await connectDB();
    await Expense.findByIdAndDelete(id);
    revalidatePath('/history');
}
