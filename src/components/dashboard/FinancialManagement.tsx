
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Target, 
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  Edit3, 
  Plus,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/utils/financeUtils";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface MonthlyBudget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  alert: boolean;
}

interface FinancialManagementProps {
  currentIncome: number;
  currentExpenses: number;
  currentSavings: number;
  onUpdateFinancials?: (income: number, expenses: number, savings: number) => void;
}

const FinancialManagement = ({ 
  currentIncome, 
  currentExpenses, 
  currentSavings,
  onUpdateFinancials 
}: FinancialManagementProps) => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: "1",
      name: "נסיעה לחו\"ל",
      targetAmount: 15000,
      currentAmount: 8500,
      deadline: "2024-12-31",
      category: "נסיעות"
    },
    {
      id: "2", 
      name: "קרן חירום",
      targetAmount: 25000,
      currentAmount: 12000,
      deadline: "2024-08-30",
      category: "ביטחון"
    }
  ]);

  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([
    { id: "1", category: "מזון", limit: 2000, spent: 1650, alert: false },
    { id: "2", category: "בילויים", limit: 800, spent: 950, alert: true },
    { id: "3", category: "תחבורה", limit: 600, spent: 420, alert: false }
  ]);

  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    category: ""
  });

  const [editingIncome, setEditingIncome] = useState(false);
  const [editingExpenses, setEditingExpenses] = useState(false);
  const [tempIncome, setTempIncome] = useState(currentIncome.toString());
  const [tempExpenses, setTempExpenses] = useState(currentExpenses.toString());

  const addSavingsGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.deadline) {
      const goal: SavingsGoal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: Number(newGoal.targetAmount),
        currentAmount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category || "כללי"
      };
      setSavingsGoals([...savingsGoals, goal]);
      setNewGoal({ name: "", targetAmount: "", deadline: "", category: "" });
    }
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    setSavingsGoals(goals => 
      goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    );
  };

  const saveIncome = () => {
    const newIncome = Number(tempIncome);
    onUpdateFinancials?.(newIncome, currentExpenses, currentSavings);
    setEditingIncome(false);
  };

  const saveExpenses = () => {
    const newExpenses = Number(tempExpenses);
    onUpdateFinancials?.(currentIncome, newExpenses, currentSavings);
    setEditingExpenses(false);
  };

  return (
    <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-card dark:to-background">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <PiggyBank className="h-6 w-6" />
          ניהול פיננסי מתקדם
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
            <TabsTrigger value="goals">יעדי חיסכון</TabsTrigger>
            <TabsTrigger value="budgets">תקציבים</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm text-muted-foreground">הכנסות חודשיות</Label>
                    {editingIncome ? (
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="number"
                          value={tempIncome}
                          onChange={(e) => setTempIncome(e.target.value)}
                          className="w-24"
                        />
                        <Button size="sm" onClick={saveIncome}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(currentIncome)}
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingIncome(true)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm text-muted-foreground">הוצאות חודשיות</Label>
                    {editingExpenses ? (
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="number"
                          value={tempExpenses}
                          onChange={(e) => setTempExpenses(e.target.value)}
                          className="w-24"
                        />
                        <Button size="sm" onClick={saveExpenses}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-red-600">
                          {formatCurrency(currentExpenses)}
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingExpenses(true)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <Wallet className="h-8 w-8 text-red-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm text-muted-foreground">חיסכון חודשי</Label>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(currentSavings)}
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">יעדי החיסכון שלי</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    יעד חדש
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>הוסף יעד חיסכון חדש</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>שם היעד</Label>
                      <Input
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                        placeholder="למשל: רכב חדש"
                      />
                    </div>
                    <div>
                      <Label>סכום יעד</Label>
                      <Input
                        type="number"
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                        placeholder="15000"
                      />
                    </div>
                    <div>
                      <Label>תאריך יעד</Label>
                      <Input
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>קטגוריה</Label>
                      <Input
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                        placeholder="רכב, נסיעות, בית..."
                      />
                    </div>
                    <Button onClick={addSavingsGoal} className="w-full">
                      הוסף יעד
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {savingsGoals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={goal.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{goal.name}</h4>
                          <Badge variant="outline" className="mt-1">{goal.category}</Badge>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {daysLeft > 0 ? `${daysLeft} ימים נותרו` : "פג תוקף"}
                          </div>
                        </div>
                      </div>
                      
                      <Progress value={progress} className="h-2" />
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateGoalProgress(goal.id, 500)}
                        >
                          +₪500
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateGoalProgress(goal.id, 1000)}
                        >
                          +₪1000
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-4">
            <h3 className="text-lg font-semibold">תקציבים חודשיים</h3>
            
            <div className="space-y-3">
              {monthlyBudgets.map((budget) => {
                const progress = (budget.spent / budget.limit) * 100;
                const isOverBudget = budget.spent > budget.limit;
                
                return (
                  <Card key={budget.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{budget.category}</h4>
                          {isOverBudget && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="text-left">
                          <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                            {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                          </span>
                        </div>
                      </div>
                      
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                      />
                      
                      <div className="text-xs text-muted-foreground">
                        {isOverBudget 
                          ? `חריגה של ${formatCurrency(budget.spent - budget.limit)}`
                          : `נותרו ${formatCurrency(budget.limit - budget.spent)}`
                        }
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialManagement;
