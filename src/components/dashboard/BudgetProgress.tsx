
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
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary">מעקב תקציב</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {budgets.map((budget) => {
          const percentage = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
          const remaining = budget.amount - budget.spent;
          
          // הגדרת הצבע לפי אחוז השימוש בתקציב
          const indicatorColor = 
            percentage >= 90 
              ? "bg-money-expense" 
              : percentage >= 75 
                ? "bg-orange-500" 
                : "bg-money-saving";
          
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{getCategoryNameById(budget.category)}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2" 
                // שימוש ב-cn כדי להחליף את הצבע של ה-indicator
                className={cn("h-2", {
                  "[&>div]:bg-money-expense": percentage >= 90,
                  "[&>div]:bg-orange-500": percentage >= 75 && percentage < 90,
                  "[&>div]:bg-money-saving": percentage < 75
                })}
              />
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
