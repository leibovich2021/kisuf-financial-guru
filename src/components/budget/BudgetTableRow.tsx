
import { formatCurrency, getCategoryNameById } from "@/utils/financeUtils";
import { Budget } from "@/types";
import { useFinancialContext } from "@/contexts/FinancialContext";
import { useToast } from "@/hooks/use-toast";
import { TableCell, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface BudgetTableRowProps {
  budget: Budget;
}

const getPeriodName = (period: string) => {
  switch (period) {
    case "daily":
      return "יומי";
    case "weekly":
      return "שבועי";
    case "monthly":
      return "חודשי";
    case "yearly":
      return "שנתי";
    default:
      return period;
  }
};

const calculateDailyBudget = (budget: Budget) => {
  switch (budget.period) {
    case "daily":
      return budget.amount;
    case "weekly":
      return budget.amount / 7;
    case "monthly":
      return budget.amount / 30;
    case "yearly":
      return budget.amount / 365;
    default:
      return budget.amount / 30;
  }
};

const calculateHourlyBudget = (budget: Budget) => {
  const dailyBudget = calculateDailyBudget(budget);
  return dailyBudget / 24;
};

export const BudgetTableRow = ({ budget }: BudgetTableRowProps) => {
  const { deleteBudget } = useFinancialContext();
  const { toast } = useToast();

  const handleDeleteBudget = (budgetId: string) => {
    deleteBudget(budgetId);
    toast({
      title: "תקציב נמחק",
      description: "התקציב נמחק מהמערכת",
    });
  };

  const percentage = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
  const remaining = budget.amount - budget.spent;
  const dailyBudget = calculateDailyBudget(budget);
  const hourlyBudget = calculateHourlyBudget(budget);

  return (
    <TableRow>
      <TableCell className="font-medium text-right">
        {getCategoryNameById(budget.category)}
      </TableCell>
      <TableCell className="text-right">
        {getPeriodName(budget.period)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(budget.amount)}
      </TableCell>
      <TableCell className="text-right text-blue-600 font-medium">
        {formatCurrency(dailyBudget)}
      </TableCell>
      <TableCell className="text-right text-green-600 font-medium">
        {formatCurrency(hourlyBudget)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(budget.spent)}
      </TableCell>
      <TableCell className="text-right">
        <span className="text-money-income">
          {formatCurrency(remaining)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center gap-2">
          <Progress value={percentage} className="h-2 flex-1" />
          <span className={percentage >= 100 ? "text-money-expense" : "text-muted-foreground"}>
            {percentage}%
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => handleDeleteBudget(budget.id)}
        >
          מחק
        </Button>
      </TableCell>
    </TableRow>
  );
};
