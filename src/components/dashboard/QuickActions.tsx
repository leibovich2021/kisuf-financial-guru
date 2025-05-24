
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calculator, 
  PieChart, 
  FileText, 
  Target, 
  TrendingUp,
  Wallet,
  CreditCard
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

const QuickActions = () => {
  const actions: QuickAction[] = [
    {
      id: "add-transaction",
      title: "הוסף עסקה",
      description: "רשום הכנסה או הוצאה חדשה",
      icon: <Plus className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
      action: () => console.log("Add transaction")
    },
    {
      id: "set-budget",
      title: "קבע תקציב",
      description: "הגדר מגבלות הוצאה חודשיות",
      icon: <Target className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
      action: () => console.log("Set budget")
    },
    {
      id: "view-reports",
      title: "דוחות פיננסיים",
      description: "צפה בניתוח מפורט של ההוצאות",
      icon: <PieChart className="h-5 w-5" />,
      color: "from-purple-500 to-indigo-500",
      action: () => console.log("View reports")
    },
    {
      id: "export-data",
      title: "ייצא נתונים",
      description: "הורד דוח Excel או PDF",
      icon: <FileText className="h-5 w-5" />,
      color: "from-orange-500 to-amber-500",
      action: () => console.log("Export data")
    },
    {
      id: "investment-tracker",
      title: "מעקב השקעות",
      description: "עקוב אחר תיק ההשקעות שלך",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "from-teal-500 to-green-500",
      action: () => console.log("Investment tracker")
    },
    {
      id: "savings-goals",
      title: "יעדי חיסכון",
      description: "הגדר ועקוב אחר יעדי חיסכון",
      icon: <Wallet className="h-5 w-5" />,
      color: "from-pink-500 to-rose-500",
      action: () => console.log("Savings goals")
    }
  ];

  return (
    <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-card dark:to-background">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          פעולות מהירות
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 group"
              onClick={action.action}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
