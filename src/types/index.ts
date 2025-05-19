
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: "income" | "expense";
  paymentMethod: "cash" | "credit" | "bankTransfer" | "other";
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon?: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  totalSaved: number;
  creditDebt: number;
  cashSpent: number;
}
