
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Budget, Transaction } from "@/types";
import { formatCurrency, getCategoryNameById } from "@/utils/financeUtils";
import { Calendar, Clock } from "lucide-react";

interface DailyWeeklyBudgetProps {
  budgets: Budget[];
  transactions: Transaction[];
}

const DailyWeeklyBudget = ({ budgets, transactions }: DailyWeeklyBudgetProps) => {
  const calculateBudgetForPeriod = (budget: Budget, period: 'daily' | 'weekly') => {
    switch (budget.period) {
      case "daily":
        return period === 'daily' ? budget.amount : budget.amount * 7;
      case "weekly":
        return period === 'daily' ? budget.amount / 7 : budget.amount;
      case "monthly":
        return period === 'daily' ? budget.amount / 30 : budget.amount / 4;
      case "yearly":
        return period === 'daily' ? budget.amount / 365 : budget.amount / 52;
      default:
        return period === 'daily' ? budget.amount / 30 : budget.amount / 4;
    }
  };

  const calculateSpentForPeriod = (budget: Budget, period: 'daily' | 'weekly') => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let startDate: Date;
    if (period === 'daily') {
      startDate = today;
    } else {
      // שבועי - מתחילים מיום ראשון
      const dayOfWeek = today.getDay();
      startDate = new Date(today);
      startDate.setDate(today.getDate() - dayOfWeek);
    }

    const relevantTransactions = transactions.filter(t => 
      t.type === "expense" && 
      t.category === budget.category &&
      new Date(t.date) >= startDate
    );

    return relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const totalDailyBudget = budgets.reduce((sum, budget) => 
    sum + calculateBudgetForPeriod(budget, 'daily'), 0
  );

  const totalWeeklyBudget = budgets.reduce((sum, budget) => 
    sum + calculateBudgetForPeriod(budget, 'weekly'), 0
  );

  const totalDailySpent = budgets.reduce((sum, budget) => 
    sum + calculateSpentForPeriod(budget, 'daily'), 0
  );

  const totalWeeklySpent = budgets.reduce((sum, budget) => 
    sum + calculateSpentForPeriod(budget, 'weekly'), 0
  );

  const dailyPercentage = totalDailyBudget > 0 ? Math.min((totalDailySpent / totalDailyBudget) * 100, 100) : 0;
  const weeklyPercentage = totalWeeklyBudget > 0 ? Math.min((totalWeeklySpent / totalWeeklyBudget) * 100, 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* תקציב יומי */}
      <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Clock className="h-5 w-5" />
            תקציב יומי
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">
              {formatCurrency(totalDailyBudget - totalDailySpent)}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              נותר מתוך {formatCurrency(totalDailyBudget)}
            </div>
          </div>
          
          <Progress 
            value={dailyPercentage} 
            className="h-3 bg-blue-200 dark:bg-blue-800"
          />
          
          <div className="flex justify-between text-sm">
            <span className="text-blue-600 dark:text-blue-400">
              הוצאו: {formatCurrency(totalDailySpent)}
            </span>
            <span className="font-medium text-blue-700 dark:text-blue-300">
              {Math.round(dailyPercentage)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* תקציב שבועי */}
      <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Calendar className="h-5 w-5" />
            תקציב שבועי
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-800 dark:text-green-200">
              {formatCurrency(totalWeeklyBudget - totalWeeklySpent)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              נותר מתוך {formatCurrency(totalWeeklyBudget)}
            </div>
          </div>
          
          <Progress 
            value={weeklyPercentage} 
            className="h-3 bg-green-200 dark:bg-green-800"
          />
          
          <div className="flex justify-between text-sm">
            <span className="text-green-600 dark:text-green-400">
              הוצאו: {formatCurrency(totalWeeklySpent)}
            </span>
            <span className="font-medium text-green-700 dark:text-green-300">
              {Math.round(weeklyPercentage)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyWeeklyBudget;
