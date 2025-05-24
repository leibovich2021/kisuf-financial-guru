
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, Hash, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/utils/financeUtils";

interface CashPaymentSummaryProps {
  totalCashPayments: number;
  cashTransactionsCount: number;
  averageCashPayment: number;
  topCashCategories: { category: string; amount: number }[];
}

const CashPaymentSummary: React.FC<CashPaymentSummaryProps> = ({
  totalCashPayments,
  cashTransactionsCount,
  averageCashPayment,
  topCashCategories
}) => {
  const maxCategoryAmount = topCashCategories.length > 0 ? topCashCategories[0].amount : 0;

  return (
    <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 dark:from-card dark:to-background">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-primary">סיכום תשלומים במזומן</CardTitle>
            <p className="text-sm text-muted-foreground">נתונים על השימוש במזומן</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* סטטיסטיקות עיקריות */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/60 dark:bg-card/60 border border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">סך הכל</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalCashPayments)}
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-white/60 dark:bg-card/60 border border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">מספר עסקאות</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {cashTransactionsCount}
            </div>
          </div>
        </div>

        {/* תשלום ממוצע */}
        <div className="p-4 rounded-xl bg-white/60 dark:bg-card/60 border border-green-200/50">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">תשלום ממוצע</span>
          </div>
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(averageCashPayment)}
          </div>
        </div>

        {/* קטגוריות מובילות */}
        {topCashCategories.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                טופ 3
              </Badge>
              קטגוריות בתשלום מזומן
            </h4>
            
            <div className="space-y-3">
              {topCashCategories.map((category, index) => {
                const percentage = maxCategoryAmount > 0 ? (category.amount / maxCategoryAmount) * 100 : 0;
                
                return (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.category}</span>
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(category.amount)}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2 bg-green-100 dark:bg-green-900"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cashTransactionsCount === 0 && (
          <div className="text-center py-6">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">אין עדיין תשלומים במזומן</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CashPaymentSummary;
