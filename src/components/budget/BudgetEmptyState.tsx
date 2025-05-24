
import { Button } from "@/components/ui/button";

interface BudgetEmptyStateProps {
  onAddBudget: () => void;
}

export const BudgetEmptyState = ({ onAddBudget }: BudgetEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground mb-4">
        עדיין אין תקציבים. הוסף תקציב חדש כדי להתחיל לעקוב אחר ההוצאות שלך.
      </p>
      <Button onClick={onAddBudget}>הוסף תקציב</Button>
    </div>
  );
};
