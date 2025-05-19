
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget } from "@/types";
import { formatCurrency, getCategoryNameById } from "@/utils/financeUtils";

interface BudgetProgressProps {
  budgets: Budget[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgets }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>מעקב תקציב</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget) => {
          const percentage = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
          const remaining = budget.amount - budget.spent;
          
          return (
            <div key={budget.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{getCategoryNameById(budget.category)}</span>
                <span>
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{percentage}% נוצל</span>
                <span>נותר: {formatCurrency(remaining)}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
