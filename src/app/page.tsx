'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useFinanceStore } from "@/hooks/use-finance-store";
import { Navbar } from "@/components/layout/Navbar";
import { OverviewCards } from "@/components/finance/OverviewCards";
import { SpendingChart } from "@/components/finance/SpendingChart";
import { ExpenseForm } from "@/components/finance/ExpenseForm";
import { BudgetGoals } from "@/components/finance/BudgetGoals";
import { ExpenseList } from "@/components/finance/ExpenseList";
import { Settings } from "@/components/finance/Settings";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const { 
    expenses, 
    budgetGoals, 
    dailyLimit, 
    addExpense, 
    deleteExpense, 
    isLoaded 
  } = useFinanceStore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || !isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto p-4 space-y-8 animate-pulse">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-4">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Financial Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user.displayName?.split(' ')[0]}</p>
        </header>

        <section>
          <OverviewCards expenses={expenses} dailyLimit={dailyLimit} />
        </section>

        <section className="grid gap-6 grid-cols-1 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <SpendingChart expenses={expenses} />
            <div id="expenses">
              <ExpenseList expenses={expenses} onDelete={deleteExpense} />
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <ExpenseForm onAdd={addExpense} historicalExpenses={expenses} />
            <BudgetGoals expenses={expenses} goals={budgetGoals} />
            <Settings />
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} SpendSense. Built for the modern saver.</p>
      </footer>
    </div>
  );
}
