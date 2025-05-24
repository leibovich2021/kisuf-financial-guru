
export interface MonthlyData {
  month: string; // YYYY-MM format
  transactions: Transaction[];
  budgets: Budget[];
  summary: Summary;
}

export interface CalendarState {
  currentMonth: string;
  monthlyData: Record<string, MonthlyData>;
}

import { Transaction, Budget, Summary } from './index';
