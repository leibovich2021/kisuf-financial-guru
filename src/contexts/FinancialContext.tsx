
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Budget } from '@/types';
import { userService } from '@/services/userService';

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

interface FinancialContextType {
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
  transferToSavings: (amount: number, goalId?: string) => void;
  
  // נתונים מחושבים
  summary: {
    totalIncome: number;
    totalExpense: number;
    totalSaved: number;
    creditDebt: number;
  };
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancialContext = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancialContext must be used within a FinancialProvider');
  }
  return context;
};

interface FinancialProviderProps {
  children: ReactNode;
}

export const FinancialProvider = ({ children }: FinancialProviderProps) => {
  const currentUser = userService.getCurrentUser();
  const userData = currentUser ? userService.getUserData(currentUser.id) : { transactions: [], budgets: [] };
  
  const [transactions, setTransactions] = useState<Transaction[]>(userData.transactions);
  const [budgets, setBudgets] = useState<Budget[]>(userData.budgets);
  const [settings, setSettings] = useState<FinancialSettings>({
    monthlyIncomeGoal: 8000,
    monthlyExpenseLimit: 6000,
    monthlySavingsGoal: 2000,
    currency: 'ILS',
    displayName: currentUser?.displayName || 'משתמש'
  });
  
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: "1",
      name: "נסיעה לחו״ל",
      targetAmount: 15000,
      currentAmount: 8500,
      deadline: "2024-12-31",
      category: "נסיעות",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "2", 
      name: "קרן חירום",
      targetAmount: 25000,
      currentAmount: 12000,
      deadline: "2024-08-30",
      category: "ביטחון",
      color: "from-green-500 to-emerald-500"
    }
  ]);

  // סנכרון עם localStorage
  useEffect(() => {
    if (currentUser) {
      userService.saveUserData(currentUser.id, { transactions, budgets, settings });
    }
  }, [transactions, budgets, settings, currentUser]);

  // חישוב סיכום אוטומטי
  const summary = React.useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const creditDebt = transactions
      .filter(t => t.type === "expense" && t.paymentMethod === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      totalSaved: totalIncome - totalExpense,
      creditDebt
    };
  }, [transactions]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<FinancialSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500"
    ];
    
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, ...updates } : goal
      )
    );
  };

  const transferToSavings = (amount: number, goalId?: string) => {
    // יצירת עסקת העברה לחיסכון
    const transferTransaction: Transaction = {
      id: Date.now().toString(),
      amount: amount,
      category: "saving",
      description: goalId 
        ? `העברה לחיסכון: ${savingsGoals.find(g => g.id === goalId)?.name}` 
        : "העברה לחיסכון",
      date: new Date().toISOString(),
      type: "income",
      paymentMethod: "bankTransfer"
    };

    addTransaction(transferTransaction);

    // עדכון יעד חיסכון ספציפי אם הוגדר
    if (goalId) {
      updateSavingsGoal(goalId, { 
        currentAmount: savingsGoals.find(g => g.id === goalId)!.currentAmount + amount 
      });
    }
  };

  const value: FinancialContextType = {
    transactions,
    budgets,
    settings,
    savingsGoals,
    addTransaction,
    deleteTransaction,
    updateSettings,
    addSavingsGoal,
    updateSavingsGoal,
    transferToSavings,
    summary
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};
