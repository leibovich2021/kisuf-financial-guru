
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Crown, Zap, Star, Check, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  popular?: boolean;
  color: string;
}

const plans: PaymentPlan[] = [
  {
    id: "basic",
    name: "בסיסי",
    price: 29,
    currency: "₪",
    period: "חודש",
    features: ["עד 100 עסקאות", "דוחות בסיסיים", "תמיכה במייל"],
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "premium",
    name: "פרמיום",
    price: 59,
    currency: "₪",
    period: "חודש",
    features: ["עסקאות ללא הגבלה", "דוחות מתקדמים", "תמיכה בטלפון", "ייצוא נתונים"],
    popular: true,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "enterprise",
    name: "עסקי",
    price: 99,
    currency: "₪",
    period: "חודש",
    features: ["כל התכונות", "API מותאם אישית", "תמיכה 24/7", "יועץ פיננסי אישי"],
    color: "from-amber-500 to-amber-600"
  }
];

const PaymentCard = () => {
  const handlePlanSelect = (planId: string, paymentMethod: 'credit' | 'cash') => {
    console.log(`Selected plan: ${planId} with payment method: ${paymentMethod}`);
    // כאן נוסיף את הלוגיקה לתשלום
  };

  return (
    <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-card dark:to-background overflow-hidden">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <Crown className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-primary mb-2">שדרג לתוכנית פרמיום</CardTitle>
        <p className="text-muted-foreground">בחר את התוכנית המתאימה לך</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md",
                plan.popular 
                  ? "border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20" 
                  : "border-border hover:border-primary/30"
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <Star className="h-3 w-3 ml-1" />
                  הכי פופולרי
                </Badge>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.currency}/{plan.period}</span>
                  </div>
                </div>
                <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", plan.color)}>
                  {plan.id === "basic" && <Zap className="h-5 w-5" />}
                  {plan.id === "premium" && <Crown className="h-5 w-5" />}
                  {plan.id === "enterprise" && <Star className="h-5 w-5" />}
                </div>
              </div>
              
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex gap-2">
                <Button 
                  className={cn(
                    "flex-1 bg-gradient-to-r text-white font-medium",
                    plan.color,
                    "hover:opacity-90 transition-opacity"
                  )}
                  onClick={() => handlePlanSelect(plan.id, 'credit')}
                >
                  <CreditCard className="h-4 w-4 ml-2" />
                  תשלום באשראי
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-2 hover:bg-green-50 dark:hover:bg-green-950/20"
                  onClick={() => handlePlanSelect(plan.id, 'cash')}
                >
                  <Wallet className="h-4 w-4 ml-2" />
                  תשלום במזומן
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
