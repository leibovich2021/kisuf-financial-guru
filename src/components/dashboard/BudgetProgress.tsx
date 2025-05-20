
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget } from "@/types";
import { formatCurrency, getCategoryNameById } from "@/utils/financeUtils";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  budgets: Budget[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgets }) => {
  return (
    <Card className="shadow-md border-0 rounded-xl bg-gradient-to-br from-white to-accent/10 dark:from-card dark:to-background hover:shadow-lg transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary">מעקב תקציב</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        {budgets.map((budget) => {
          const percentage = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
          const remaining = budget.amount - budget.spent;
          
          return (
            <div key={budget.id} className="space-y-2 animate-fade-in">
              <div className="flex justify-between text-sm font-medium">
                <span>{getCategoryNameById(budget.category)}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                </span>
              </div>
              <Progress 
                value={percentage} 
                className={cn("h-3 rounded-full", {
                  "[&>div]:bg-money-expense [&>div]:rounded-full": percentage >= 90,
                  "[&>div]:bg-orange-500 [&>div]:rounded-full": percentage >= 75 && percentage < 90,
                  "[&>div]:bg-money-saving [&>div]:rounded-full": percentage < 75
                })}
              />
              <div className="flex justify-between text-xs">
                <span className="font-medium">{percentage}% נוצל</span>
                <span className="text-muted-foreground">נותר: {formatCurrency(remaining)}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
