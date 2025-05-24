
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import SummaryCard from "@/components/dashboard/SummaryCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExpensesByCategory from "@/components/dashboard/ExpensesByCategory";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import FinancialInsights from "@/components/dashboard/FinancialInsights";
import CashPaymentSummary from "@/components/dashboard/CashPaymentSummary";
import FinancialManagement from "@/components/dashboard/FinancialManagement";
import CalendarManager from "@/components/dashboard/CalendarManager";
import { AppLayout } from "@/components/layout/AppLayout";
import { transactions as initialTransactions, budgets as initialBudgets } from "@/data/mockData";
import { calculateSummary, getRecentTransactions, getBudgetStatus, getCashPaymentSummary } from "@/utils/financeUtils";
import { Transaction } from "@/types";
import { MonthlyData } from "@/types/calendar";
import TransactionForm from "@/components/transactions/TransactionForm";
import { Wallet, CreditCard, ArrowUp, ArrowDown, Sparkles } from "lucide-react";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData | null>(null);
  
  // השתמש בנתונים של החודש הנוכחי אם זמינים, אחרת השתמש בנתונים הכלליים
  const activeTransactions = currentMonthData?.transactions || transactions;
  const activeBudgets = currentMonthData?.budgets || budgets;
  
  const summary = currentMonthData?.summary || calculateSummary(activeTransactions);
  const recentTransactions = getRecentTransactions(activeTransactions);
  const budgetStatus = getBudgetStatus(activeBudgets, activeTransactions);
  const cashSummary = getCashPaymentSummary(activeTransactions);
  
  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    // עדכן את העסקאות הראשיות
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    
    // אם יש נתוני חודש נוכחי, עדכן גם אותם
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
      <PageHeader
        heading="לוח מחוונים"
        subheading="סקירה כללית של המצב הכלכלי שלך"
      >
        <div className="flex gap-2">
          <TransactionForm onAddTransaction={handleAddTransaction} />
        </div>
      </PageHeader>

      {/* מנהל לוח שנה */}
      <div className="mb-8 animate-fade-in">
        <CalendarManager
          transactions={transactions}
          budgets={budgets}
          onMonthChange={handleMonthChange}
        />
      </div>
      
      {/* כרטיסי סיכום ראשיים */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 mt-6 animate-fade-in">
        <SummaryCard
          title="סך הכנסות"
          amount={summary.totalIncome}
          type="income"
          icon={<ArrowDown />}
        />
        <SummaryCard
          title="סך הוצאות"
          amount={summary.totalExpense}
          type="expense"
          icon={<ArrowUp />}
        />
        <SummaryCard
          title="חסכונות"
          amount={summary.totalSaved}
          type="saving"
          icon={<Wallet />}
        />
        <SummaryCard
          title="חיוב אשראי"
          amount={summary.creditDebt}
          type="expense"
          icon={<CreditCard />}
        />
      </div>

      {/* ניהול פיננסי מתקדם */}
      <div className="mb-8 animate-fade-in">
        <FinancialManagement
          currentIncome={summary.totalIncome}
          currentExpenses={summary.totalExpense}
          currentSavings={summary.totalSaved}
          onUpdateFinancials={handleUpdateFinancials}
        />
      </div>

      {/* סטטיסטיקות מתקדמות */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 animate-fade-in">
        <StatisticsCard
          title="הכנסות החודש"
          currentValue={summary.totalIncome}
          previousValue={4200}
          target={6000}
          period="החודש"
          type="income"
        />
        <StatisticsCard
          title="הוצאות החודש"
          currentValue={summary.totalExpense}
          previousValue={3800}
          target={4000}
          period="החודש"
          type="expense"
        />
        <StatisticsCard
          title="חיסכון החודש"
          currentValue={summary.totalSaved}
          previousValue={400}
          target={2000}
          period="החודש"
          type="saving"
        />
      </div>

      {/* פעולות מהירות */}
      <div className="mb-8 animate-fade-in">
        <QuickActions onAddTransaction={openTransactionForm} />
      </div>
      
      {/* תוכן ראשי */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3 mb-8 animate-fade-in">
        <div className="xl:col-span-2 space-y-6">
          <RecentTransactions 
            transactions={recentTransactions} 
            onDeleteTransaction={handleDeleteTransaction}
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
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
