// Frequency types
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'seasonal' | 'yearly' | 'custom';

// Template for pre-built tracker types
export interface TrackerTemplate {
  id: string;
  name: string;
  category: string;
  frequency: Frequency;
  suggestedFields: string[];
  icon: string;
  color: string;
}

// User's custom tracker
export interface Tracker {
  id: string;
  name: string;
  frequency: Frequency;
  category: string;
  customFields: string[];
  budgetLimit?: number;
  color: string;
  icon: string;
  createdAt: Date;
  isActive: boolean;
}

// Individual expense entry
export interface Expense {
  id: string;
  trackerId: string;
  amount: number;
  date: Date;
  category?: string;
  description: string;
  paymentMethod?: string;
  tags?: string[];
  customFieldValues?: Record<string, string>;
}

// Monthly aggregation
export interface MonthlyReport {
  month: string;
  year: number;
  totalExpenses: number;
  byTracker: {
    trackerId: string;
    trackerName: string;
    total: number;
    count: number;
  }[];
  byCategory: {
    category: string;
    total: number;
  }[];
}

// User preferences
export interface UserPreferences {
  currency: string;
  dateFormat: string;
}

