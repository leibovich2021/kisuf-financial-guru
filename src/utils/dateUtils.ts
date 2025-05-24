
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { he } from "date-fns/locale";

export const getCurrentMonthKey = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthKey = (date: Date): string => {
  return format(date, 'yyyy-MM');
};

export const getMonthDisplayName = (monthKey: string): string => {
  const date = new Date(monthKey + '-01');
  return format(date, 'MMMM yyyy', { locale: he });
};

export const isTransactionInMonth = (transactionDate: string, monthKey: string): boolean => {
  const date = new Date(transactionDate);
  const monthStart = startOfMonth(new Date(monthKey + '-01'));
  const monthEnd = endOfMonth(new Date(monthKey + '-01'));
  
  return isWithinInterval(date, { start: monthStart, end: monthEnd });
};

export const filterTransactionsByMonth = <T extends { date: string }>(
  transactions: T[], 
  monthKey: string
): T[] => {
  return transactions.filter(transaction => 
    isTransactionInMonth(transaction.date, monthKey)
  );
};

export const getAllAvailableMonths = <T extends { date: string }>(transactions: T[]): string[] => {
  const months = new Set<string>();
  
  transactions.forEach(transaction => {
    const monthKey = getMonthKey(new Date(transaction.date));
    months.add(monthKey);
  });
  
  return Array.from(months).sort().reverse();
};
