
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, Target } from "lucide-react";
import { formatCurrency } from "@/utils/financeUtils";

interface StatisticsCardProps {
  title: string;
  currentValue: number;
  previousValue: number;
  target?: number;
  period: string;
  type: "income" | "expense" | "saving";
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  currentValue,
  previousValue,
  target,
  period,
  type
}) => {
  const change = currentValue - previousValue;
  const changePercentage = previousValue !== 0 ? (change / previousValue) * 100 : 0;
  const isPositive = change >= 0;
  const targetProgress = target ? (currentValue / target) * 100 : 0;

  const getColorByType = () => {
    switch (type) {
      case "income":
        return "from-green-500 to-emerald-500";
      case "expense":
        return "from-red-500 to-pink-500";
      case "saving":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-purple-500 to-indigo-500";
    }
  };

  const getIconByType = () => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-5 w-5" />;
      case "expense":
        return <TrendingDown className="h-5 w-5" />;
      case "saving":
        return <Target className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg border-0 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-card dark:to-background hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-700 dark:text-gray-300">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getColorByType()} text-white`}>
            {getIconByType()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-3xl font-bold text-primary mb-1">
            {formatCurrency(currentValue)}
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isPositive ? "default" : "destructive"}
              className={`text-xs ${
                isPositive 
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {isPositive ? "+" : ""}{changePercentage.toFixed(1)}%
            </Badge>
            <span className="text-sm text-muted-foreground">מ{period} הקודם</span>
          </div>
        </div>

        {target && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">יעד:</span>
              <span className="font-medium">{formatCurrency(target)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${getColorByType()} transition-all duration-500`}
                style={{ width: `${Math.min(targetProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {targetProgress.toFixed(1)}% מהיעד
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
