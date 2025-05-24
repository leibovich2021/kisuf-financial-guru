
import { Transaction, Budget } from './index';

export interface FinancialSettings {
  monthlyIncomeGoal: number;
  monthlyExpenseLimit: number;
  monthlySavingsGoal: number;
  currency: string;
  displayName: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  color: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  totalSaved: number;
  creditDebt: number;
}

export interface FinancialContextType {
  // נתונים בסיסיים
  transactions: Transaction[];
  budgets: Budget[];
  settings: FinancialSettings;
  savingsGoals: SavingsGoal[];
  
  // פעולות עדכון
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateSettings: (newSettings: Partial<FinancialSettings>) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  transferToSavings: (amount: number, goalId?: string) => void;
  
  // נתונים מחושבים
  summary: FinancialSummary;
}
