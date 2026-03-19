
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Expense, BudgetGoal } from "@/lib/types";
import { useMemo } from "react";
import { format } from "date-fns";
import { Target } from "lucide-react";

interface BudgetGoalsProps {
  expenses: Expense[];
  goals: BudgetGoal[];
}

export function BudgetGoals({ expenses, goals }: BudgetGoalsProps) {
  const currentMonth = format(new Date(), 'yyyy-MM');

  const budgets = useMemo(() => {
    return goals.map(goal => {
      const spent = expenses
        .filter(e => e.date.startsWith(currentMonth) && e.category === goal.category)
        .reduce((sum, e) => sum + e.amount, 0);
      
      const percentage = Math.min((spent / goal.limit) * 100, 100);
      const isOver = spent > goal.limit;

      return {
        ...goal,
        spent,
        percentage,
        isOver
      };
    });
  }, [expenses, goals, currentMonth]);

  return (
    <Card className="h-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl">Budget Goals</CardTitle>
          <CardDescription>Monthly limits by category</CardDescription>
        </div>
        <Target className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground italic">
            No budget goals set yet.
          </div>
        ) : (
          budgets.map(budget => (
            <div key={budget.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{budget.category}</span>
                <span className={budget.isOver ? 'text-destructive font-bold' : 'text-muted-foreground'}>
                  ₹{budget.spent.toLocaleString('en-IN')} / ₹{budget.limit.toLocaleString('en-IN')}
                </span>
              </div>
              <Progress 
                value={budget.percentage} 
                className={`h-2 ${budget.isOver ? 'bg-destructive/20' : ''}`}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
