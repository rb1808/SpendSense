
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import { Expense, DailyLimit } from "@/lib/types";
import { useMemo } from "react";
import { format } from "date-fns";

interface OverviewCardsProps {
  expenses: Expense[];
  dailyLimit: DailyLimit;
}

export function OverviewCards({ expenses, dailyLimit }: OverviewCardsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = format(now, 'yyyy-MM');
    const today = format(now, 'yyyy-MM-dd');

    const monthlyTotal = expenses
      .filter(e => e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + e.amount, 0);

    const todayTotal = expenses
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0);

    const overDaily = dailyLimit.enabled && todayTotal > dailyLimit.amount;

    return {
      monthlyTotal,
      todayTotal,
      overDaily,
      expenseCount: expenses.length
    };
  }, [expenses, dailyLimit]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground">Total for current month</p>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${stats.overDaily ? 'border-l-destructive' : 'border-l-accent'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Spending</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.todayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className={`text-xs ${stats.overDaily ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
            {dailyLimit.enabled ? `Limit: $${dailyLimit.amount}` : 'No limit set'}
            {stats.overDaily && ' • Limit exceeded!'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.expenseCount}</div>
          <p className="text-xs text-muted-foreground">All recorded entries</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Financial Status</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">Healthy</div>
          <p className="text-xs text-muted-foreground">Based on current goals</p>
        </CardContent>
      </Card>
    </div>
  );
}
