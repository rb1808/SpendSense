
"use client";

import { useFinanceStore } from "@/hooks/use-finance-store";
import { Navbar } from "@/components/layout/Navbar";
import { OverviewCards } from "@/components/finance/OverviewCards";
import { SpendingChart } from "@/components/finance/SpendingChart";
import { ExpenseForm } from "@/components/finance/ExpenseForm";
import { BudgetGoals } from "@/components/finance/BudgetGoals";
import { ExpenseList } from "@/components/finance/ExpenseList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { 
    expenses, 
    budgetGoals, 
    dailyLimit, 
    addExpense, 
    deleteExpense, 
    isLoaded 
  } = useFinanceStore();

  if (!isLoaded) {
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
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Financial Dashboard
          </h1>
          <OverviewCards expenses={expenses} dailyLimit={dailyLimit} />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingChart expenses={expenses} />
          </div>
          <div className="space-y-6">
            <ExpenseForm onAdd={addExpense} historicalExpenses={expenses} />
            <BudgetGoals expenses={expenses} goals={budgetGoals} />
          </div>
        </section>

        <section id="expenses">
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        </section>
      </main>

      <footer className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} SpendSense. Smart financial control at your fingertips.</p>
      </footer>
    </div>
  );
}
