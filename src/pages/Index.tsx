
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards";
import DashboardStatistics from "@/components/dashboard/DashboardStatistics";
import DashboardContent from "@/components/dashboard/DashboardContent";
import FinancialManagement from "@/components/dashboard/FinancialManagement";
import CalendarManager from "@/components/dashboard/CalendarManager";
import QuickActions from "@/components/dashboard/QuickActions";
import { AppLayout } from "@/components/layout/AppLayout";
import { calculateSummary, getRecentTransactions, getBudgetStatus, getCashPaymentSummary } from "@/utils/financeUtils";
import { Transaction } from "@/types";
import { MonthlyData } from "@/types/calendar";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const currentUser = userService.getCurrentUser();
  const userData = currentUser ? userService.getUserData(currentUser.id) : { transactions: [], budgets: [] };
  
  const [transactions, setTransactions] = useState<Transaction[]>(userData.transactions);
  const [budgets, setBudgets] = useState(userData.budgets);
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (currentUser) {
      userService.saveUserData(currentUser.id, { transactions, budgets });
    }
  }, [transactions, budgets, currentUser]);
  
  const activeTransactions = currentMonthData?.transactions || transactions;
  const activeBudgets = currentMonthData?.budgets || budgets;
  
  const summary = currentMonthData?.summary || calculateSummary(activeTransactions);
  const recentTransactions = getRecentTransactions(activeTransactions);
  const budgetStatus = getBudgetStatus(activeBudgets, activeTransactions);
  const cashSummary = getCashPaymentSummary(activeTransactions);
  
  const handleAddTransaction = (newTransaction: Transaction) => {
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    
    if (currentMonthData) {
      setCurrentMonthData(prev => {
        if (!prev) return prev;
        const updatedTransactions = prev.transactions.filter(t => t.id !== transactionId);
        return {
          ...prev,
          transactions: updatedTransactions,
          summary: calculateSummary(updatedTransactions)
        };
      });
    }
  };

  const handleTransferToSavings = (amount: number) => {
    if (amount <= 0) return;
    
    const transferTransaction: Transaction = {
      id: Date.now().toString(),
      amount: amount,
      category: "saving",
      description: "העברה לחיסכון",
      date: new Date().toISOString(),
      type: "expense",
      paymentMethod: "bankTransfer"
    };

    const savingTransaction: Transaction = {
      id: (Date.now() + 1).toString(),
      amount: amount,
      category: "saving",
      description: "חיסכון",
      date: new Date().toISOString(),
      type: "income",
      paymentMethod: "bankTransfer"
    };

    const updatedTransactions = [...transactions, transferTransaction, savingTransaction];
    setTransactions(updatedTransactions);

    toast({
      title: "הועבר לחיסכון",
      description: `${amount}₪ הועברו לחיסכון בהצלחה`,
    });
  };
  
  const openTransactionForm = () => {
    const addButton = document.querySelector('[data-testid="add-transaction-button"]');
    if (addButton) {
      (addButton as HTMLButtonElement).click();
    }
  };

  const handleUpdateFinancials = (income: number, expenses: number, savings: number) => {
    console.log("Updated financials:", { income, expenses, savings });
  };

  const handleMonthChange = (month: string, monthlyData: MonthlyData) => {
    setCurrentMonthData(monthlyData);
    console.log("Changed to month:", month, monthlyData);
  };
  
  return (
    <AppLayout>
      <DashboardHeader onAddTransaction={handleAddTransaction} />

      <div className="mb-8 animate-fade-in">
        <CalendarManager
          transactions={transactions}
          budgets={budgets}
          onMonthChange={handleMonthChange}
        />
      </div>
      
      <DashboardSummaryCards 
        summary={summary}
        onTransferToSavings={handleTransferToSavings}
      />

      <div className="mb-8 animate-fade-in">
        <FinancialManagement
          currentIncome={summary.totalIncome}
          currentExpenses={summary.totalExpense}
          currentSavings={summary.totalSaved}
          onUpdateFinancials={handleUpdateFinancials}
        />
      </div>

      <DashboardStatistics summary={summary} />

      <div className="mb-8 animate-fade-in">
        <QuickActions onAddTransaction={openTransactionForm} />
      </div>
      
      <DashboardContent
        recentTransactions={recentTransactions}
        cashSummary={cashSummary}
        activeTransactions={activeTransactions}
        budgetStatus={budgetStatus}
        currentSavings={summary.totalSaved}
        onDeleteTransaction={handleDeleteTransaction}
        onAddSavingsTransaction={handleAddTransaction}
      />
    </AppLayout>
  );
};

export default DashboardPage;
