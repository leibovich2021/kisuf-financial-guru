
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PiggyBank } from "lucide-react";
import { formatCurrency } from "@/utils/financeUtils";
import { useToast } from "@/hooks/use-toast";

interface SummaryCardProps {
  title: string;
  amount: number;
  type?: "income" | "expense" | "saving" | "default";
  icon?: React.ReactNode;
  onTransferToSavings?: (amount: number) => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  amount, 
  type = "default", 
  icon,
  onTransferToSavings 
}) => {
  const [transferAmount, setTransferAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleTransfer = () => {
    const amount = Number(transferAmount);
    if (amount > 0 && onTransferToSavings) {
      onTransferToSavings(amount);
      setTransferAmount("");
      setIsDialogOpen(false);
      
      toast({
        title: "הועבר לחיסכון",
        description: `${formatCurrency(amount)} הועברו לחיסכון בהצלחה`,
      });
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getGradientByType()} shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border-0 overflow-hidden card-hover`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {icon && <div className={`h-10 w-10 p-1.5 rounded-full bg-white/90 dark:bg-background/80 shadow-sm ${getColorByType()}`}>{icon}</div>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-2xl font-bold ${getColorByType()}`}>
          {formatCurrency(amount)}
        </div>
        
        {type === "income" && onTransferToSavings && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs bg-white/90 hover:bg-white"
              >
                <PiggyBank className="h-3 w-3 mr-1" />
                העבר לחיסכון
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>העברה לחיסכון</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">סכום להעברה</label>
                  <Input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="הזן סכום"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleTransfer} className="flex-1">
                    אשר העברה
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    ביטול
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
