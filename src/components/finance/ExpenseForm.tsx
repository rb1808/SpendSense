
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { aiCategorizeTransaction } from "@/ai/flows/ai-categorize-transaction";
import { Expense } from "@/lib/types";

const CATEGORIES = [
  "Groceries", "Dining Out", "Utilities", "Transportation", 
  "Shopping", "Entertainment", "Rent", "Salary", "Miscellaneous"
];

interface ExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  historicalExpenses: Expense[];
}

export function ExpenseForm({ onAdd, historicalExpenses }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleAiSuggest = async () => {
    if (!description) return;
    setIsCategorizing(true);
    try {
      const result = await aiCategorizeTransaction({
        transactionDescription: description,
        historicalTransactions: historicalExpenses.map(e => ({
          description: e.description,
          category: e.category,
          amount: e.amount
        }))
      });
      if (result.suggestedCategory) {
        setCategory(result.suggestedCategory);
      }
    } catch (e) {
      console.error("AI Categorization failed", e);
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) return;
    onAdd({
      description,
      amount: parseFloat(amount),
      category,
      date
    });
    setDescription("");
    setAmount("");
    setCategory("");
  };

  return (
    <Card className="h-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Add Expense</CardTitle>
        <CardDescription>Record a new transaction manually or use AI suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="flex gap-2">
              <Input 
                id="description" 
                placeholder="e.g. Weekly Groceries" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="secondary" 
                size="icon" 
                title="AI Suggest Category"
                onClick={handleAiSuggest}
                disabled={isCategorizing || !description}
              >
                {isCategorizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
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
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
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
          <Button type="submit" className="w-full mt-2">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
