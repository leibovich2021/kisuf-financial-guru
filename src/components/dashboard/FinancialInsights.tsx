
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Target,
  PiggyBank
} from "lucide-react";
import { formatCurrency } from "@/utils/financeUtils";

interface Insight {
  id: string;
  type: "tip" | "warning" | "success";
  title: string;
  description: string;
  action?: string;
  value?: number;
  maxValue?: number;
}

const FinancialInsights = () => {
  const insights: Insight[] = [
    {
      id: "savings-tip",
      type: "tip",
      title: "הזדמנות לחיסכון",
      description: "הוצאת 23% יותר על בילויים החודש. נסה להגביל את ההוצאה ל-₪1,200",
      action: "קבע תקציב בילויים"
    },
    {
      id: "budget-warning",
      type: "warning",
      title: "התקרבת לגבול התקציב",
      description: "השתמשת ב-87% מתקציב המזון החודשי",
      value: 87,
      maxValue: 100
    },
    {
      id: "goal-success",
      type: "success",
      title: "יעד חיסכון הושג!",
      description: "הגעת ליעד החיסכון החודשי שלך ב-₪2,500",
      action: "הגדר יעד חדש"
    },
    {
      id: "investment-tip",
      type: "tip",
      title: "הצעה להשקעה",
      description: "יש לך ₪5,000 בחשבון הבנק. שקול להשקיע חלק מהסכום",
      action: "למד על השקעות"
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "tip":
        return <Lightbulb className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "tip":
        return "from-blue-500 to-cyan-500";
      case "warning":
        return "from-orange-500 to-amber-500";
      case "success":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "tip":
        return "secondary";
      case "warning":
        return "destructive";
      case "success":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 dark:from-card dark:to-background">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <PiggyBank className="h-6 w-6" />
          תובנות פיננסיות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-xl border border-border/50 bg-white/50 dark:bg-card/50 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type)} text-white flex-shrink-0`}>
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                  <Badge variant={getBadgeVariant(insight.type)} className="text-xs">
                    {insight.type === "tip" && "טיפ"}
                    {insight.type === "warning" && "אזהרה"}
                    {insight.type === "success" && "הצלחה"}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                
                {insight.value && insight.maxValue && (
                  <div className="space-y-1">
                    <Progress value={insight.value} className="h-2" />
                    <div className="text-xs text-muted-foreground text-left">
                      {insight.value}% מהתקציב
                    </div>
                  </div>
                )}
                
                {insight.action && (
                  <button className="text-xs text-primary hover:underline font-medium">
                    {insight.action} ←
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FinancialInsights;
