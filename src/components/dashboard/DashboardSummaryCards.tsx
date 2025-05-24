
import { ArrowUp, ArrowDown, Wallet, CreditCard } from "lucide-react";
import SummaryCard from "./SummaryCard";

interface DashboardSummaryCardsProps {
  summary: {
    totalIncome: number;
    totalExpense: number;
    totalSaved: number;
    creditDebt: number;
  };
  onTransferToSavings: (amount: number) => void;
}

const DashboardSummaryCards = ({ summary, onTransferToSavings }: DashboardSummaryCardsProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 mt-6 animate-fade-in">
      <SummaryCard
        title="סך הכנסות"
        amount={summary.totalIncome}
        type="income"
        icon={<ArrowDown />}
        onTransferToSavings={onTransferToSavings}
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
  );
};

export default DashboardSummaryCards;
