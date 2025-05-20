
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import SummaryCard from "@/components/dashboard/SummaryCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExpensesByCategory from "@/components/dashboard/ExpensesByCategory";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import { AppLayout } from "@/components/layout/AppLayout";
import { transactions as initialTransactions, budgets as initialBudgets } from "@/data/mockData";
import { calculateSummary, getRecentTransactions, getBudgetStatus } from "@/utils/financeUtils";
import { Transaction } from "@/types";
import TransactionForm from "@/components/transactions/TransactionForm";
import { Wallet, CreditCard, ArrowUp, ArrowDown } from "lucide-react";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  
  const summary = calculateSummary(transactions);
  const recentTransactions = getRecentTransactions(transactions);
  const budgetStatus = getBudgetStatus(budgets, transactions);
  
  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction]);
  };
  
  return (
    <AppLayout>
      <PageHeader
        heading="לוח מחוונים"
        subheading="סקירה כללית של המצב הכלכלי שלך"
      >
        <TransactionForm onAddTransaction={handleAddTransaction} />
      </PageHeader>
      
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 mt-6 animate-fade-in">
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
      
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-3 mb-6 animate-fade-in">
        <RecentTransactions transactions={recentTransactions} />
        <div className="space-y-5">
          <ExpensesByCategory transactions={transactions} />
          <BudgetProgress budgets={budgetStatus} />
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
