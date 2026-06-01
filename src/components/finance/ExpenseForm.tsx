"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { Expense } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Groceries", "Dining Out", "Utilities", "Transportation", 
  "Shopping", "Entertainment", "Rent", "Salary", "Miscellaneous"
];

import { addExpenseAction } from "@/app/actions";

interface ExpenseFormProps {
  historicalExpenses: Expense[];
}

export function ExpenseForm({ historicalExpenses }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) return;
    
    setIsSubmitting(true);
    try {
      const result = await addExpenseAction({
        description,
        amount: parseFloat(amount),
        category,
        date
      });
      
      if (result?.success) {
        toast({
          title: "Expense Added",
          description: `₹${parseFloat(amount).toLocaleString('en-IN')} for "${description}" recorded.`,
        });
        setDescription("");
        setAmount("");
        setCategory("");
      } else {
        toast({
          title: "Error",
          description: result?.error || "Failed to add expense.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Add Expense</CardTitle>
        <CardDescription>Record a new transaction manually</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              placeholder="e.g. Weekly Groceries" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input 
                id="amount" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required disabled={isSubmitting}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" /> Add Expense</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}