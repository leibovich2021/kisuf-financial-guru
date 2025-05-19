
import { Transaction, Category, Budget, Summary } from "../types";
import { categories, transactions } from "../data/mockData";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryNameById = (id: string): string => {
  const category = getCategoryById(id);
  return category ? category.name : "לא ידוע";
};

export const calculateSummary = (transactions: Transaction[]): Summary => {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const creditDebt = transactions
    .filter(t => t.type === "expense" && t.paymentMethod === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const cashSpent = transactions
    .filter(t => t.type === "expense" && t.paymentMethod === "cash")
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalIncome,
    totalExpense,
    totalSaved: totalIncome - totalExpense,
    creditDebt,
    cashSpent
  };
};

export const getTransactionsByCategory = (transactions: Transaction[]): Record<string, number> => {
  const result: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const categoryName = getCategoryNameById(transaction.category);
    if (!result[categoryName]) {
      result[categoryName] = 0;
    }
    result[categoryName] += transaction.amount;
  });
  
  return result;
};

export const getRecentTransactions = (transactions: Transaction[], count: number = 5): Transaction[] => {
  return [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};

export const getBudgetStatus = (budgets: Budget[], transactions: Transaction[]): Budget[] => {
  return budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === "expense" && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...budget,
      spent
    };
  });
};
