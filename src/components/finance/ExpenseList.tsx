"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Expense } from "@/lib/types";
import { Search, Trash2, Filter, Pencil, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { deleteExpenseAction, editExpenseAction } from "@/app/actions";

const CATEGORIES = [
  "All", "Groceries", "Dining Out", "Utilities", "Transportation", 
  "Shopping", "Entertainment", "Rent", "Salary", "Miscellaneous"
];

interface ExpenseListProps {
  expenses: Expense[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit state
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const result = await deleteExpenseAction(deleteId);
      if (result?.success) {
        toast({ title: "Deleted", description: "Expense removed successfully." });
      } else {
        toast({ title: "Error", description: result?.error || "Failed to delete.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDescription(expense.description);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditDate(expense.date);
  };

  const handleSaveEdit = async () => {
    if (!editingExpense) return;
    setIsSavingEdit(true);
    try {
      const result = await editExpenseAction(editingExpense.id, {
        description: editDescription,
        amount: parseFloat(editAmount),
        category: editCategory,
        date: editDate,
      });
      if (result?.success) {
        toast({ title: "Updated", description: "Expense updated successfully." });
        setEditingExpense(null);
      } else {
        toast({ title: "Error", description: result?.error || "Failed to update.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <>
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle className="text-xl">Transactions</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant={showFilter ? "default" : "outline"} 
              size="icon" 
              className="h-9 w-9 shrink-0"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {showFilter && (
          <div className="px-6 pb-4 flex items-center gap-3">
            <Label className="text-sm text-muted-foreground whitespace-nowrap">Category:</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryFilter !== "All" && (
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setCategoryFilter("All")}>
                <X className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}
          </div>
        )}

        <CardContent className="p-0 sm:p-6">
          <div className="relative w-full overflow-x-auto border-t sm:border sm:rounded-md">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      {expenses.length === 0 ? "No transactions yet. Add one above!" : "No matching transactions found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium whitespace-nowrap">
                        {expense.date.split('-').reverse().join('/')}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal text-[10px] sm:text-xs">
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold whitespace-nowrap">
                        ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEdit(expense)}
                            className="text-muted-foreground hover:text-primary h-8 w-8"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setDeleteId(expense.id)}
                            className="text-muted-foreground hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredExpenses.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3 px-1">
              Showing {filteredExpenses.length} of {expenses.length} transactions
            </p>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Make changes to the expense details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input 
                id="edit-description" 
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                disabled={isSavingEdit}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount (₹)</Label>
                <Input 
                  id="edit-amount" 
                  type="number" 
                  step="0.01" 
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  disabled={isSavingEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input 
                  id="edit-date" 
                  type="date" 
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  disabled={isSavingEdit}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory} disabled={isSavingEdit}>
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(c => c !== "All").map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingExpense(null)} disabled={isSavingEdit}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={isSavingEdit}>
              {isSavingEdit ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
