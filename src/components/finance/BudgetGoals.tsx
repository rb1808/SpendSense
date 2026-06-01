
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Expense, BudgetGoal } from "@/lib/types";
import { useMemo } from "react";
import { format } from "date-fns";
import { Target, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updateBudgetGoalAction, deleteBudgetGoalAction } from "@/app/actions";

const CATEGORIES = [
  "Groceries", "Dining Out", "Utilities", "Transportation", 
  "Shopping", "Entertainment", "Rent", "Salary", "Miscellaneous"
];

interface BudgetGoalsProps {
  expenses: Expense[];
  goals: BudgetGoal[];
}

export function BudgetGoals({ expenses, goals }: BudgetGoalsProps) {
  const currentMonth = format(new Date(), 'yyyy-MM');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<BudgetGoal | null>(null);

  const budgets = useMemo(() => {
    return goals.map(goal => {
      const spent = expenses
        .filter(e => e.date.startsWith(currentMonth) && e.category === goal.category)
        .reduce((sum, e) => sum + e.amount, 0);
      
      const percentage = goal.limit > 0 ? Math.min((spent / goal.limit) * 100, 100) : 0;
      const isOver = spent > goal.limit;

      return {
        ...goal,
        spent,
        percentage,
        isOver
      };
    });
  }, [expenses, goals, currentMonth]);

  // Categories not yet tracked
  const availableCategories = CATEGORIES.filter(
    cat => !goals.some(g => g.category === cat)
  );

  const openAddDialog = () => {
    setEditingGoal(null);
    setSelectedCategory("");
    setLimitAmount("");
    setDialogOpen(true);
  };

  const openEditDialog = (goal: BudgetGoal) => {
    setEditingGoal(goal);
    setSelectedCategory(goal.category);
    setLimitAmount(goal.limit.toString());
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedCategory || !limitAmount) return;
    setIsSaving(true);
    try {
      const result = await updateBudgetGoalAction(selectedCategory, parseFloat(limitAmount));
      if (result?.success) {
        toast({
          title: editingGoal ? "Budget Updated" : "Budget Goal Added",
          description: `₹${parseFloat(limitAmount).toLocaleString('en-IN')} limit set for ${selectedCategory}.`,
        });
        setDialogOpen(false);
      } else {
        toast({ title: "Error", description: result?.error || "Failed to save.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: string) => {
    setDeletingCategory(category);
    try {
      const result = await deleteBudgetGoalAction(category);
      if (result?.success) {
        toast({ title: "Removed", description: `Budget goal for ${category} removed.` });
      } else {
        toast({ title: "Error", description: result?.error || "Failed to remove.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setDeletingCategory(null);
    }
  };

  return (
    <Card className="h-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl">Budget Goals</CardTitle>
          <CardDescription>Monthly limits by category</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={openAddDialog} disabled={availableCategories.length === 0}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="italic">No budget goals set yet.</p>
            <p className="text-xs mt-1">Click "Add" above to set your first budget.</p>
          </div>
        ) : (
          budgets.map(budget => (
            <div key={budget.category} className="space-y-2 group">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{budget.category}</span>
                <div className="flex items-center gap-2">
                  <span className={budget.isOver ? 'text-destructive font-bold' : 'text-muted-foreground'}>
                    ₹{budget.spent.toLocaleString('en-IN')} / ₹{budget.limit.toLocaleString('en-IN')}
                  </span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditDialog(budget)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-destructive" 
                      onClick={() => handleDelete(budget.category)}
                      disabled={deletingCategory === budget.category}
                    >
                      {deletingCategory === budget.category ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <Progress 
                value={budget.percentage} 
                className={`h-2 ${budget.isOver ? 'bg-destructive/20' : ''}`}
              />
            </div>
          ))
        )}
      </CardContent>

      {/* Add/Edit Budget Goal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit Budget Goal" : "Add Budget Goal"}</DialogTitle>
            <DialogDescription>
              {editingGoal 
                ? `Update the monthly limit for ${editingGoal.category}.`
                : "Set a monthly spending limit for a category."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              {editingGoal ? (
                <Input value={selectedCategory} disabled />
              ) : (
                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isSaving}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label>Monthly Limit (₹)</Label>
              <Input 
                type="number" 
                step="100" 
                placeholder="e.g. 5000" 
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || !selectedCategory || !limitAmount}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
