
import { BudgetForm } from "@/components/budget/BudgetForm";
import { Button } from "@/components/ui/button";

export const BudgetEmptyState = () => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground mb-4">
        עדיין אין תקציבים. הוסף תקציב חדש כדי להתחיל לעקוב אחר ההוצאות שלך.
      </p>
      <BudgetForm trigger={<Button>הוסף תקציב</Button>} />
    </div>
  );
};
