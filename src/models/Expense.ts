import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
    trackerId: mongoose.Types.ObjectId;
    amount: number;
    date: Date;
    category?: string;
    description: string;
    paymentMethod?: string;
    tags?: string[];
    customFieldValues?: Map<string, string>;
}

const ExpenseSchema: Schema = new Schema({
    trackerId: { type: Schema.Types.ObjectId, ref: 'Tracker', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    category: { type: String },
    description: { type: String, required: true },
    paymentMethod: { type: String },
    tags: [{ type: String }],
    customFieldValues: { type: Map, of: String }
});

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
