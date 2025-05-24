
import { useState } from "react";
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
  CreditCard,
  Search
} from "lucide-react";
import CommandPalette from "./CommandPalette";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

interface QuickActionsProps {
  onAddTransaction?: () => void;
}

const QuickActions = ({ onAddTransaction }: QuickActionsProps) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const actions: QuickAction[] = [
    {
      id: "add-transaction",
      title: "הוסף עסקה",
      description: "רשום הכנסה או הוצאה חדשה",
      icon: <Plus className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
      action: () => {
        onAddTransaction?.();
        console.log("Opening add transaction form");
      }
    },
    {
      id: "set-budget",
      title: "קבע תקציב",
      description: "הגדר מגבלות הוצאה חודשיות",
      icon: <Target className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
      action: () => {
        // Navigate to budget page
        window.location.href = "/budget";
      }
    },
    {
      id: "view-reports",
      title: "דוחות פיננסיים",
      description: "צפה בניתוח מפורט של ההוצאות",
      icon: <PieChart className="h-5 w-5" />,
      color: "from-purple-500 to-indigo-500",
      action: () => {
        // Navigate to transactions page for reports
        window.location.href = "/transactions";
      }
    },
    {
      id: "export-data",
      title: "ייצא נתונים",
      description: "הורד דוח Excel או PDF",
      icon: <FileText className="h-5 w-5" />,
      color: "from-orange-500 to-amber-500",
      action: () => {
        // Trigger data export - for now just show alert
        alert("פונקציית ייצוא נתונים תתווסף בקרוב");
      }
    },
    {
      id: "investment-tracker",
      title: "מעקב השקעות",
      description: "עקוב אחר תיק ההשקעות שלך",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "from-teal-500 to-green-500",
      action: () => {
        alert("מעקב השקעות יתווסף בגרסה הבאה");
      }
    },
    {
      id: "savings-goals",
      title: "יעדי חיסכון",
      description: "הגדר ועקוב אחר יעדי חיסכון",
      icon: <Wallet className="h-5 w-5" />,
      color: "from-pink-500 to-rose-500",
      action: () => {
        alert("יעדי חיסכון יתווספו בגרסה הבאה");
      }
    }
  ];

  return (
    <>
      <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-card dark:to-background">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              פעולות מהירות
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">חיפוש מהיר</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
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

      <CommandPalette 
        open={commandPaletteOpen} 
        setOpen={setCommandPaletteOpen}
        onAddTransaction={onAddTransaction}
      />
    </>
  );
};

export default QuickActions;
