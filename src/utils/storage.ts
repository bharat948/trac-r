import type { Tracker, Expense, TrackerTemplate, UserPreferences } from '../types';

const STORAGE_KEYS = {
  TRACKERS: 'expense_trackers',
  EXPENSES: 'expense_entries',
  TEMPLATES: 'tracker_templates',
  PREFERENCES: 'user_preferences',
} as const;

// Helper to serialize dates
function serializeDates<T extends { date?: Date; createdAt?: Date }>(data: T[]): any[] {
  return data.map(item => ({
    ...item,
    date: item.date ? item.date.toISOString() : undefined,
    createdAt: item.createdAt ? item.createdAt.toISOString() : undefined,
  }));
}

// Helper to deserialize dates
function deserializeDates<T extends { date?: string; createdAt?: string }>(data: T[]): any[] {
  return data.map(item => ({
    ...item,
    date: item.date ? new Date(item.date) : undefined,
    createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
  }));
}

// Trackers
export function saveTrackers(trackers: Tracker[]): void {
  try {
    const serialized = serializeDates(trackers);
    localStorage.setItem(STORAGE_KEYS.TRACKERS, JSON.stringify(serialized));
  } catch (error) {
    console.error('Error saving trackers:', error);
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please clear some data.');
    }
  }
}

export function loadTrackers(): Tracker[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRACKERS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return deserializeDates(parsed) as Tracker[];
  } catch (error) {
    console.error('Error loading trackers:', error);
    return [];
  }
}

// Expenses
export function saveExpenses(expenses: Expense[]): void {
  try {
    const serialized = serializeDates(expenses);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(serialized));
  } catch (error) {
    console.error('Error saving expenses:', error);
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please clear some data.');
    }
  }
}

export function loadExpenses(): Expense[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return deserializeDates(parsed) as Expense[];
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
}

// Templates
export function saveTemplates(templates: TrackerTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving templates:', error);
  }
}

export function loadTemplates(): TrackerTemplate[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!data) return [];
    return JSON.parse(data) as TrackerTemplate[];
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
}

// User Preferences
export function savePreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

export function loadPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!data) {
      return {
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
      };
    }
    return JSON.parse(data) as UserPreferences;
  } catch (error) {
    console.error('Error loading preferences:', error);
    return {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
    };
  }
}

// Clear all data
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.TRACKERS);
  localStorage.removeItem(STORAGE_KEYS.EXPENSES);
  localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
  localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
}

