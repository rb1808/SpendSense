
"use client";

import { useState, useEffect } from 'react';
import { Expense, BudgetGoal, DailyLimit, AppState } from '@/lib/types';

const STORAGE_KEY = 'spendsense_data_v2';

const REVIEWER_DATA: AppState = {
  expenses: [
    { id: '1', description: 'Monthly House Rent', amount: 25000, category: 'Rent', date: new Date().toISOString().split('T')[0] },
    { id: '2', description: 'BigBasket Groceries', amount: 4500.50, category: 'Groceries', date: new Date().toISOString().split('T')[0] },
    { id: '3', description: 'Petrol - Bharat Petroleum', amount: 3200, category: 'Transportation', date: new Date().toISOString().split('T')[0] },
    { id: '4', description: 'Zomato Dinner', amount: 1250.75, category: 'Dining Out', date: new Date().toISOString().split('T')[0] },
    { id: '5', description: 'Electricity Bill', amount: 2800, category: 'Utilities', date: new Date().toISOString().split('T')[0] },
    { id: '6', description: 'Netflix Premium', amount: 649, category: 'Entertainment', date: new Date().toISOString().split('T')[0] },
  ],
  budgetGoals: [
    { category: 'Groceries', limit: 15000 },
    { category: 'Dining Out', limit: 8000 },
    { category: 'Transportation', limit: 10000 },
    { category: 'Entertainment', limit: 5000 },
  ],
  dailyLimit: { amount: 2000, enabled: true },
};

export function useFinanceStore() {
  const [state, setState] = useState<AppState>(REVIEWER_DATA);
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

  const seedTestData = () => {
    setState(REVIEWER_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(REVIEWER_DATA));
  };

  return {
    ...state,
    addExpense,
    deleteExpense,
    updateBudgetGoal,
    updateDailyLimit,
    seedTestData,
    isLoaded
  };
}
