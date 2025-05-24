
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Budget, Transaction } from "@/types";
import { formatCurrency, getCategoryNameById } from "@/utils/financeUtils";
import { Calendar, Clock, Settings, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DailyWeeklyBudgetProps {
  budgets: Budget[];
  transactions: Transaction[];
  onBudgetUpdate: (budgetId: string, updates: Partial<Budget>) => void;
  onBudgetAdd: (budget: Omit<Budget, 'id'>) => void;
  onBudgetDelete: (budgetId: string) => void;
}

const DailyWeeklyBudget = ({ budgets, transactions, onBudgetUpdate, onBudgetAdd, onBudgetDelete }: DailyWeeklyBudgetProps) => {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    period: "monthly" as Budget['period']
  });
  const { toast } = useToast();

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

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.amount) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות",
        variant: "destructive",
      });
      return;
    }

    onBudgetAdd({
      category: newBudget.category,
      amount: parseFloat(newBudget.amount),
      period: newBudget.period,
      spent: 0
    });

    setNewBudget({ category: "", amount: "", period: "monthly" });
    setIsAddOpen(false);
    toast({
      title: "התקציב נוסף בהצלחה",
      description: "התקציב החדש נוסף למערכת",
    });
  };

  const handleDeleteBudget = (budgetId: string) => {
    onBudgetDelete(budgetId);
    toast({
      title: "התקציב נמחק",
      description: "התקציב נמחק מהמערכת",
    });
  };

  const categories = [
    "food", "transportation", "entertainment", "shopping", "bills", 
    "healthcare", "education", "saving", "other"
  ];

  return (
    <div className="space-y-4">
      {/* כותרת עם כפתור ניהול */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">תקציב יומי ושבועי</h2>
        <div className="flex gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 ml-2" />
                הוסף תקציב
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>הוספת תקציב חדש</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">קטגוריה</Label>
                  <Select value={newBudget.category} onValueChange={(value) => setNewBudget({...newBudget, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {getCategoryNameById(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">סכום</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                    placeholder="הכנס סכום"
                  />
                </div>
                <div>
                  <Label htmlFor="period">תקופה</Label>
                  <Select value={newBudget.period} onValueChange={(value) => setNewBudget({...newBudget, period: value as Budget['period']})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">יומי</SelectItem>
                      <SelectItem value="weekly">שבועי</SelectItem>
                      <SelectItem value="monthly">חודשי</SelectItem>
                      <SelectItem value="yearly">שנתי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddBudget} className="w-full">
                  הוסף תקציב
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 ml-2" />
                נהל תקציבים
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>ניהול תקציבים</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {budgets.map((budget) => (
                  <div key={budget.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{getCategoryNameById(budget.category)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(budget.amount)} - {budget.period === "daily" ? "יומי" : 
                         budget.period === "weekly" ? "שבועי" : 
                         budget.period === "monthly" ? "חודשי" : "שנתי"}
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteBudget(budget.id)}
                    >
                      מחק
                    </Button>
                  </div>
                ))}
                {budgets.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    אין תקציבים מוגדרים
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* כרטיסי התקציב */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};

export default DailyWeeklyBudget;
