
import RecentTransactions from "./RecentTransactions";
import FinancialInsights from "./FinancialInsights";
import CashPaymentSummary from "./CashPaymentSummary";
import ExpensesByCategory from "./ExpensesByCategory";
import BudgetProgress from "./BudgetProgress";
import SavingsManagement from "./SavingsManagement";
import { Transaction, Budget } from "@/types";

interface DashboardContentProps {
  recentTransactions: Transaction[];
  cashSummary: {
    totalCashPayments: number;
    cashTransactionsCount: number;
    averageCashPayment: number;
    topCashCategories: { category: string; amount: number }[];
  };
  activeTransactions: Transaction[];
  budgetStatus: Budget[];
  currentSavings: number;
  onDeleteTransaction: (transactionId: string) => void;
  onAddSavingsTransaction: (transaction: Transaction) => void;
}

const DashboardContent = ({
  recentTransactions,
  cashSummary,
  activeTransactions,
  budgetStatus,
  currentSavings,
  onDeleteTransaction,
  onAddSavingsTransaction
}: DashboardContentProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-4">
        <div className="xl:col-span-2 space-y-6">
          <RecentTransactions 
            transactions={recentTransactions} 
            onDeleteTransaction={onDeleteTransaction}
          />
          <FinancialInsights />
        </div>
        
        <div className="space-y-6">
          <CashPaymentSummary 
            totalCashPayments={cashSummary.totalCashPayments}
            cashTransactionsCount={cashSummary.cashTransactionsCount}
            averageCashPayment={cashSummary.averageCashPayment}
            topCashCategories={cashSummary.topCashCategories}
          />
          <ExpensesByCategory transactions={activeTransactions} />
          <BudgetProgress budgets={budgetStatus} />
        </div>

        <div className="space-y-6">
          <SavingsManagement 
            currentSavings={currentSavings}
            onAddSavingsTransaction={onAddSavingsTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
