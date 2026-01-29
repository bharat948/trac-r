'use server';

import connectDB from '@/lib/mongodb';
import Tracker, { ITracker } from '@/models/Tracker';
import { revalidatePath } from 'next/cache';

export async function getTrackers() {
    await connectDB();
    const trackers = await Tracker.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(trackers));
}

export async function createTracker(formData: any) {
    await connectDB();
    const tracker = await Tracker.create(formData);
    revalidatePath('/trackers');
    return JSON.parse(JSON.stringify(tracker));
}

export async function updateTracker(id: string, formData: any) {
    await connectDB();
    const tracker = await Tracker.findByIdAndUpdate(id, formData, { new: true });
    revalidatePath('/trackers');
    return JSON.parse(JSON.stringify(tracker));
}

export async function deleteTracker(id: string) {
    await connectDB();
    await Tracker.findByIdAndDelete(id);
    revalidatePath('/trackers');
}
