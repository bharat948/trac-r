import { create } from 'zustand';
import type { Tracker, Expense, TrackerTemplate, UserPreferences } from '../types';
import {
  saveTrackers,
  loadTrackers,
  saveExpenses,
  loadExpenses,
  saveTemplates,
  loadTemplates,
  savePreferences,
  loadPreferences,
} from '../utils/storage';
import { templates as defaultTemplates, trackers as defaultTrackers, expenses as defaultExpenses } from '../utils/dummyData';

interface ExpenseState {
  // State
  trackers: Tracker[];
  expenses: Expense[];
  templates: TrackerTemplate[];
  preferences: UserPreferences;
  
  // Initialization
  initialize: () => void;
  
  // Tracker actions
  addTracker: (tracker: Tracker) => void;
  updateTracker: (id: string, updates: Partial<Tracker>) => void;
  deleteTracker: (id: string) => void;
  
  // Expense actions
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Template actions
  addTemplate: (template: TrackerTemplate) => void;
  
  // Preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  // Initial state
  trackers: [],
  expenses: [],
  templates: [],
  preferences: {
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
  },
  
  // Initialize from localStorage or use dummy data
  initialize: () => {
    const savedTrackers = loadTrackers();
    const savedExpenses = loadExpenses();
    const savedTemplates = loadTemplates();
    const savedPreferences = loadPreferences();
    
    // If no data exists, use dummy data
    if (savedTrackers.length === 0 && savedExpenses.length === 0) {
      // Save dummy data
      saveTrackers(defaultTrackers);
      saveExpenses(defaultExpenses);
      saveTemplates(defaultTemplates);
      
      set({
        trackers: defaultTrackers,
        expenses: defaultExpenses,
        templates: defaultTemplates,
        preferences: savedPreferences,
      });
    } else {
      set({
        trackers: savedTrackers,
        expenses: savedExpenses,
        templates: savedTemplates.length > 0 ? savedTemplates : defaultTemplates,
        preferences: savedPreferences,
      });
    }
  },
  
  // Tracker actions
  addTracker: (tracker) => {
    const newTrackers = [...get().trackers, tracker];
    saveTrackers(newTrackers);
    set({ trackers: newTrackers });
  },
  
  updateTracker: (id, updates) => {
    const updatedTrackers = get().trackers.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    saveTrackers(updatedTrackers);
    set({ trackers: updatedTrackers });
  },
  
  deleteTracker: (id) => {
    const filteredTrackers = get().trackers.filter(t => t.id !== id);
    // Also delete associated expenses
    const filteredExpenses = get().expenses.filter(e => e.trackerId !== id);
    saveTrackers(filteredTrackers);
    saveExpenses(filteredExpenses);
    set({
      trackers: filteredTrackers,
      expenses: filteredExpenses,
    });
  },
  
  // Expense actions
  addExpense: (expense) => {
    const newExpenses = [...get().expenses, expense];
    saveExpenses(newExpenses);
    set({ expenses: newExpenses });
  },
  
  updateExpense: (id, updates) => {
    const updatedExpenses = get().expenses.map(e =>
      e.id === id ? { ...e, ...updates } : e
    );
    saveExpenses(updatedExpenses);
    set({ expenses: updatedExpenses });
  },
  
  deleteExpense: (id) => {
    const filteredExpenses = get().expenses.filter(e => e.id !== id);
    saveExpenses(filteredExpenses);
    set({ expenses: filteredExpenses });
  },
  
  // Template actions
  addTemplate: (template) => {
    const newTemplates = [...get().templates, template];
    saveTemplates(newTemplates);
    set({ templates: newTemplates });
  },
  
  // Preferences
  updatePreferences: (updates) => {
    const newPreferences = { ...get().preferences, ...updates };
    savePreferences(newPreferences);
    set({ preferences: newPreferences });
  },
}));

