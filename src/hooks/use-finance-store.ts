
"use client";

import { useState, useEffect } from 'react';
import { Expense, BudgetGoal, DailyLimit, AppState } from '@/lib/types';

const STORAGE_KEY = 'spendsense_data';

const DEFAULT_STATE: AppState = {
  expenses: [
    { id: '1', description: 'Monthly Rent', amount: 1200, category: 'Rent', date: '2024-03-01' },
    { id: '2', description: 'Whole Foods Market', amount: 85.50, category: 'Groceries', date: '2024-03-02' },
    { id: '3', description: 'Shell Petrol', amount: 45.00, category: 'Transportation', date: '2024-03-03' },
    { id: '4', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: '2024-03-04' },
    { id: '5', description: 'Starbucks Coffee', amount: 6.50, category: 'Dining Out', date: '2024-03-05' },
  ],
  budgetGoals: [
    { category: 'Groceries', limit: 400 },
    { category: 'Dining Out', limit: 200 },
    { category: 'Transportation', limit: 150 },
    { category: 'Entertainment', limit: 100 },
  ],
  dailyLimit: { amount: 50, enabled: true },
};

export function useFinanceStore() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => ({ ...prev, expenses: [newExpense, ...prev.expenses] }));
  };

  const deleteExpense = (id: string) => {
    setState(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  const updateBudgetGoal = (category: string, limit: number) => {
    setState(prev => {
      const existing = prev.budgetGoals.find(b => b.category === category);
      if (existing) {
        return {
          ...prev,
          budgetGoals: prev.budgetGoals.map(b => b.category === category ? { ...b, limit } : b)
        };
      }
      return {
        ...prev,
        budgetGoals: [...prev.budgetGoals, { category, limit }]
      };
    });
  };

  const updateDailyLimit = (limit: DailyLimit) => {
    setState(prev => ({ ...prev, dailyLimit: limit }));
  };

  return {
    ...state,
    addExpense,
    deleteExpense,
    updateBudgetGoal,
    updateDailyLimit,
    isLoaded
  };
}
