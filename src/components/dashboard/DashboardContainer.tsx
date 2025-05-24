
import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSummaryCards from "./DashboardSummaryCards";
import DashboardStatistics from "./DashboardStatistics";
import DashboardContent from "./DashboardContent";
import CalendarManager from "./CalendarManager";
import DailyWeeklyBudget from "./DailyWeeklyBudget";
import { useFinancialContext } from "@/contexts/FinancialContext";
import { getRecentTransactions, getBudgetStatus, getCashPaymentSummary } from "@/utils/financeUtils";
import { MonthlyData } from "@/types/calendar";
import { Budget } from "@/types";

const DashboardContainer = () => {
  const { 
    transactions, 
    budgets, 
    summary, 
    settings,
    addTransaction, 
    deleteTransaction, 
    transferToSavings,
    updateSettings,
    addBudget,
    updateBudget,
    deleteBudget
  } = useFinancialContext();
  
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData | null>(null);
  
  const activeTransactions = currentMonthData?.transactions || transactions;
  const activeBudgets = currentMonthData?.budgets || budgets;
  const activeSummary = currentMonthData?.summary || summary;
  
  const recentTransactions = getRecentTransactions(activeTransactions);
  const budgetStatus = getBudgetStatus(activeBudgets, activeTransactions);
  const cashSummary = getCashPaymentSummary(activeTransactions);
  
  const openTransactionForm = () => {
    const addButton = document.querySelector('[data-testid="add-transaction-button"]');
    if (addButton) {
      (addButton as HTMLButtonElement).click();
    }
  };

  const handleMonthChange = (month: string, monthlyData: MonthlyData) => {
    setCurrentMonthData(monthlyData);
  };

  const handleBudgetUpdate = (budgetId: string, updates: Partial<Budget>) => {
    updateBudget(budgetId, updates);
  };

  const handleBudgetAdd = (budget: Omit<Budget, 'id'>) => {
    addBudget(budget);
  };

  const handleBudgetDelete = (budgetId: string) => {
    deleteBudget(budgetId);
  };
  
  return (
    <>
      <DashboardHeader onAddTransaction={addTransaction} />

      {/* תקציב יומי ושבועי בחלק העליון */}
      <div className="mb-8 animate-fade-in">
        <DailyWeeklyBudget 
          budgets={activeBudgets} 
          transactions={activeTransactions}
          onBudgetUpdate={handleBudgetUpdate}
          onBudgetAdd={handleBudgetAdd}
          onBudgetDelete={handleBudgetDelete}
        />
      </div>

      <div className="mb-8 animate-fade-in">
        <CalendarManager
          transactions={transactions}
          budgets={budgets}
          onMonthChange={handleMonthChange}
        />
      </div>
      
      <DashboardSummaryCards 
        summary={activeSummary}
        onTransferToSavings={transferToSavings}
      />

      <DashboardStatistics summary={activeSummary} />
      
      <DashboardContent
        recentTransactions={recentTransactions}
        cashSummary={cashSummary}
        activeTransactions={activeTransactions}
        budgetStatus={budgetStatus}
        currentSavings={activeSummary.totalSaved}
        onDeleteTransaction={deleteTransaction}
        onAddSavingsTransaction={addTransaction}
      />
    </>
  );
};

export default DashboardContainer;
