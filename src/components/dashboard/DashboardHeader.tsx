
import { PageHeader } from "@/components/ui/page-header";
import TransactionForm from "@/components/transactions/TransactionForm";
import { Transaction } from "@/types";

interface DashboardHeaderProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const DashboardHeader = ({ onAddTransaction }: DashboardHeaderProps) => {
  return (
    <PageHeader
      heading="לוח מחוונים"
      subheading="סקירה כללית של המצב הכלכלי שלך"
    >
      <div className="flex gap-2">
        <TransactionForm onAddTransaction={onAddTransaction} />
      </div>
    </PageHeader>
  );
};

export default DashboardHeader;
