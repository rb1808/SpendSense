"use client";

import { useMemo } from 'react';
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useDoc, 
  useMemoFirebase,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking
} from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { Expense, BudgetGoal, DailyLimit } from '@/lib/types';

export function useFinanceStore() {
  const { user } = useUser();
  const db = useFirestore();

  // Expenses Reference
  const expensesRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "expenses");
  }, [db, user]);

  // Budgets Reference
  const budgetsRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "budgets");
  }, [db, user]);

  // Profile Reference (for daily limit)
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: expensesData, isLoading: expensesLoading } = useCollection<Expense>(expensesRef);
  const { data: budgetsData, isLoading: budgetsLoading } = useCollection<BudgetGoal>(budgetsRef);
  const { data: profileData, isLoading: profileLoading } = useDoc(profileRef);

  const expenses = useMemo(() => expensesData || [], [expensesData]);
  const budgetGoals = useMemo(() => budgetsData || [], [budgetsData]);
  
  const dailyLimit: DailyLimit = useMemo(() => ({
    amount: profileData?.dailySpendingLimit || 0,
    enabled: !!profileData?.dailySpendingLimit && profileData?.dailySpendingLimit > 0
  }), [profileData]);

  const isLoaded = !expensesLoading && !budgetsLoading && !profileLoading;

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    if (!expensesRef || !user) return;
    addDocumentNonBlocking(expensesRef, {
      ...expense,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const deleteExpense = (id: string) => {
    if (!db || !user) return;
    const docRef = doc(db, "users", user.uid, "expenses", id);
    deleteDocumentNonBlocking(docRef);
  };

  const updateBudgetGoal = (category: string, limit: number) => {
    if (!budgetsRef || !user) return;
    addDocumentNonBlocking(budgetsRef, {
      category,
      budgetAmount: limit,
      userId: user.uid,
      period: new Date().toISOString().split('-').slice(0, 2).join('-'), // YYYY-MM
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  return {
    expenses,
    budgetGoals,
    dailyLimit,
    addExpense,
    deleteExpense,
    updateBudgetGoal,
    isLoaded
  };
}
