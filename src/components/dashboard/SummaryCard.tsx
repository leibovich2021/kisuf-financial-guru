
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
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
