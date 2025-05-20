
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/financeUtils";

interface SummaryCardProps {
  title: string;
  amount: number;
  type?: "income" | "expense" | "saving" | "default";
  icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type = "default", icon }) => {
  const getColorByType = () => {
    switch (type) {
      case "income":
        return "text-money-income";
      case "expense":
        return "text-money-expense";
      case "saving":
        return "text-money-saving";
      default:
        return "text-money";
    }
  };

  const getGradientByType = () => {
    switch (type) {
      case "income":
        return "from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10";
      case "expense":
        return "from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10";
      case "saving":
        return "from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10";
      default:
        return "from-accent/30 to-accent/10";
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getGradientByType()} shadow-sm hover:shadow-md transition-shadow card-hover border-0`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {icon && <div className={`h-7 w-7 p-1 rounded-full bg-background/80 ${getColorByType()}`}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getColorByType()}`}>
          {formatCurrency(amount)}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
