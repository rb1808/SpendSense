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
    // Mandatory login for Trial App experience
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || !isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto p-4 space-y-8 animate-pulse">
          <div className="grid gap-4 md:grid-cols-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <main className="container mx-auto p-4 space-y-8 mt-4">
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Financial Dashboard
            </h1>
          </div>
          <OverviewCards expenses={expenses} dailyLimit={dailyLimit} />
        </section>

        {/* Primary Analysis Section */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingChart expenses={expenses} />
          </div>
          <div>
            <ExpenseForm onAdd={addExpense} historicalExpenses={expenses} />
          </div>
        </section>

        {/* Secondary Data Section */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2" id="expenses">
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>
          <div>
            <BudgetGoals expenses={expenses} goals={budgetGoals} />
          </div>
        </section>

        <section className="max-w-2xl mx-auto">
          <Settings />
        </section>
      </main>

      <footer className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} SpendSense. Smart financial control at your fingertips.</p>
      </footer>
    </div>
  );
}
