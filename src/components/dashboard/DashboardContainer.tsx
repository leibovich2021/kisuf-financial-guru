
import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSummaryCards from "./DashboardSummaryCards";
import DashboardStatistics from "./DashboardStatistics";
import DashboardContent from "./DashboardContent";
import CalendarManager from "./CalendarManager";
import QuickActions from "./QuickActions";
import { useFinancialContext } from "@/contexts/FinancialContext";
import { getRecentTransactions, getBudgetStatus, getCashPaymentSummary } from "@/utils/financeUtils";
import { MonthlyData } from "@/types/calendar";

const DashboardContainer = () => {
  const { 
    transactions, 
    budgets, 
    summary, 
    settings,
    addTransaction, 
    deleteTransaction, 
    transferToSavings,
    updateSettings
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
  
  return (
    <>
      <DashboardHeader onAddTransaction={addTransaction} />

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

      <div className="mb-8 animate-fade-in">
        <QuickActions onAddTransaction={openTransactionForm} />
      </div>
      
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
