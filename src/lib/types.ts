
export type Category = 
  | "Groceries" 
  | "Dining Out" 
  | "Utilities" 
  | "Transportation" 
  | "Shopping" 
  | "Entertainment" 
  | "Rent" 
  | "Salary" 
  | "Miscellaneous";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface BudgetGoal {
  category: string;
  limit: number;
}

export interface DailyLimit {
  amount: number;
  enabled: boolean;
}

export interface AppState {
  expenses: Expense[];
  budgetGoals: BudgetGoal[];
  dailyLimit: DailyLimit;
}
