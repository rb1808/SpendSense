import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { OverviewCards } from "@/components/finance/OverviewCards";
import { SpendingChart } from "@/components/finance/SpendingChart";
import { ExpenseForm } from "@/components/finance/ExpenseForm";
import { BudgetGoals } from "@/components/finance/BudgetGoals";
import { ExpenseList } from "@/components/finance/ExpenseList";
import { Settings } from "@/components/finance/Settings";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      expenses: {
        orderBy: { createdAt: 'desc' }
      },
      budgets: true
    }
  });

  if (!user) {
    redirect('/login');
  }

  const expenses = user.expenses;
  const budgetGoals = user.budgets.map(b => ({ category: b.category, limit: b.limit }));
  
  const dailyLimit = {
    amount: user.dailySpendingLimit || 0,
    enabled: (user.dailySpendingLimit || 0) > 0
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar user={session.user} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-4">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Financial Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user.name || session.user.name}</p>
        </header>

        <section>
          <OverviewCards expenses={expenses} dailyLimit={dailyLimit} />
        </section>

        <section className="grid gap-6 grid-cols-1 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <SpendingChart expenses={expenses} />
            <div id="expenses">
              <ExpenseList expenses={expenses} />
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <ExpenseForm historicalExpenses={expenses} />
            <BudgetGoals expenses={expenses} goals={budgetGoals} />
            <Settings initialSettings={{
              dailySpendingLimit: user.dailySpendingLimit || 0,
              receiveDailyAlerts: user.receiveDailyAlerts || false,
              receiveMonthlyReports: user.receiveMonthlyReports || false,
            }} />
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} SpendSense. Built for the modern saver.</p>
      </footer>
    </div>
  );
}
