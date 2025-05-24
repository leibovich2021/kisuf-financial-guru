
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  PiggyBank, 
  Target, 
  Plus,
  TrendingUp,
  Calendar,
  Wallet,
  Trash2
} from "lucide-react";
import { formatCurrency } from "@/utils/financeUtils";
import { useToast } from "@/hooks/use-toast";
import { useFinancialContext } from "@/contexts/FinancialContext";

interface SavingsManagementProps {
  currentSavings: number;
  onAddSavingsTransaction: (transaction: any) => void;
}

const SavingsManagement = ({ currentSavings }: SavingsManagementProps) => {
  const { toast } = useToast();
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, transferToSavings } = useFinancialContext();
  
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    category: ""
  });

  const [depositAmount, setDepositAmount] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");

  const handleAddSavingsGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.deadline) {
      addSavingsGoal({
        name: newGoal.name,
        targetAmount: Number(newGoal.targetAmount),
        currentAmount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category || "כללי",
        color: "from-blue-500 to-cyan-500"
      });
      
      setNewGoal({ name: "", targetAmount: "", deadline: "", category: "" });
      
      toast({
        title: "יעד חיסכון נוסף",
        description: `יעד "${newGoal.name}" נוצר בהצלחה`,
      });
    }
  };

  const handleDeleteSavingsGoal = (goalId: string, goalName: string) => {
    deleteSavingsGoal(goalId);
    
    toast({
      title: "יעד חיסכון נמחק",
      description: `יעד "${goalName}" נמחק בהצלחה`,
      variant: "destructive"
    });
  };

  const addToSavingsGoal = () => {
    const amount = Number(depositAmount);
    if (amount > 0 && selectedGoalId) {
      transferToSavings(amount, selectedGoalId);
      
      setDepositAmount("");
      setSelectedGoalId("");
      
      toast({
        title: "הופקד לחיסכון",
        description: `${formatCurrency(amount)} הופקדו בהצלחה`,
      });
    }
  };

  const totalSavingsGoals = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTargets > 0 ? (totalSavingsGoals / totalTargets) * 100 : 0;

  return (
    <Card className="h-fit shadow-lg border-0 rounded-2xl bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 dark:from-card dark:to-background">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <PiggyBank className="h-6 w-6" />
          ניהול חסכונות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* סיכום חסכונות */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm text-muted-foreground">סך חסכונות</Label>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(currentSavings)}
                </div>
              </div>
              <Wallet className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm text-muted-foreground">יעדי חיסכון</Label>
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(totalSavingsGoals)} / {formatCurrency(totalTargets)}
                </div>
                <Progress value={overallProgress} className="h-2 mt-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {overallProgress.toFixed(1)}% מהיעד הכולל
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* פעולות מהירות */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                יעד חדש
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>יעד חיסכון חדש</DialogTitle>
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
                <Button onClick={handleAddSavingsGoal} className="w-full">
                  הוסף יעד
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                הפקד
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>הפקדה לחיסכון</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>בחר יעד</Label>
                  <select 
                    className="w-full p-2 border border-input rounded-md"
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                  >
                    <option value="">בחר יעד חיסכון</option>
                    {savingsGoals.map(goal => (
                      <option key={goal.id} value={goal.id}>
                        {goal.name} ({formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>סכום להפקדה</Label>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="הזן סכום"
                  />
                </div>
                <Button onClick={addToSavingsGoal} className="w-full">
                  הפקד לחיסכון
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* רשימת יעדי חיסכון */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base">יעדי החיסכון שלי</h4>
          {savingsGoals.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">
              אין יעדי חיסכון. צור יעד חדש להתחלה!
            </Card>
          ) : (
            savingsGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={goal.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-sm">{goal.name}</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSavingsGoal(goal.id, goal.name)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">{goal.category}</Badge>
                      </div>
                      <div className="text-left mr-4">
                        <div className="text-sm font-medium">
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {daysLeft > 0 ? `${daysLeft} ימים נותרו` : "פג תוקף"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progress.toFixed(1)}% הושלם</span>
                        <span>נותרו {formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsManagement;
