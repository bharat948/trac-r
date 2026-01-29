import mongoose, { Schema, Document } from 'mongoose';

export interface ITracker extends Document {
    name: string;
    frequency: string;
    category: string;
    customFields: string[];
    budgetLimit?: number;
    color: string;
    icon: string;
    isActive: boolean;
    createdAt: Date;
}

const TrackerSchema: Schema = new Schema({
    name: { type: String, required: true },
    frequency: { type: String, required: true },
    category: { type: String, required: true },
    customFields: [{ type: String }],
    budgetLimit: { type: Number },
    color: { type: String, required: true },
    icon: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Tracker || mongoose.model<ITracker>('Tracker', TrackerSchema);
