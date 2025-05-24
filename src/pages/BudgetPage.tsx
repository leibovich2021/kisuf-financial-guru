
import { PageHeader } from "@/components/ui/page-header";
import { AppLayout } from "@/components/layout/AppLayout";
import { getBudgetStatus } from "@/utils/financeUtils";
import { useFinancialContext } from "@/contexts/FinancialContext";
import { Button } from "@/components/ui/button";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { BudgetTable } from "@/components/budget/BudgetTable";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";

const BudgetPage = () => {
  const { budgets, transactions } = useFinancialContext();

  const budgetStatus = getBudgetStatus(budgets, transactions);

  return (
    <AppLayout>
      <PageHeader heading="תקציב" subheading="הגדר וצפה בתקציבים שלך">
        <BudgetForm trigger={<Button>הוסף תקציב</Button>} />
      </PageHeader>
      
      <div className="mt-6">
        {budgetStatus.length > 0 ? (
          <BudgetTable budgets={budgetStatus} />
        ) : (
          <BudgetEmptyState />
        )}
      </div>
    </AppLayout>
  );
};

export default BudgetPage;
