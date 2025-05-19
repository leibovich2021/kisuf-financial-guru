
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { AppLayout } from "@/components/layout/AppLayout";
import { budgets as initialBudgets, categories } from "@/data/mockData";
import { transactions as initialTransactions } from "@/data/mockData";
import { getBudgetStatus, formatCurrency, getCategoryNameById } from "@/utils/financeUtils";
import { Budget } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
// Removed uuid import

const formSchema = z.object({
  category: z.string().nonempty({ message: "יש לבחור קטגוריה" }),
  amount: z.coerce.number().positive({ message: "הסכום חייב להיות חיובי" }),
  period: z.enum(["daily", "weekly", "monthly", "yearly"], { required_error: "יש לבחור תקופה" }),
});

const BudgetPage = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      period: "monthly",
    },
  });

  const budgetStatus = getBudgetStatus(budgets, initialTransactions);

  const availableCategories = categories
    .filter(category => category.type === "expense")
    .filter(category => !budgets.some(budget => budget.category === category.id));

  const handleAddBudget = (values: z.infer<typeof formSchema>) => {
    const newBudget: Budget = {
      id: Date.now().toString(), // Using timestamp instead of uuid for unique ID
      category: values.category,
      amount: values.amount,
      spent: 0,
      period: values.period,
    };

    setBudgets([...budgets, newBudget]);
    toast({
      title: "תקציב נוסף בהצלחה",
      description: `תקציב עבור ${getCategoryNameById(values.category)} נוסף`,
    });
    form.reset();
    setOpen(false);
  };

  const getPeriodName = (period: string) => {
    switch (period) {
      case "daily":
        return "יומי";
      case "weekly":
        return "שבועי";
      case "monthly":
        return "חודשי";
      case "yearly":
        return "שנתי";
      default:
        return period;
    }
  };

  return (
    <AppLayout>
      <PageHeader heading="תקציב" subheading="הגדר וצפה בתקציבים שלך">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>הוסף תקציב</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>הוסף תקציב חדש</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddBudget)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>קטגוריה</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר קטגוריה" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCategories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>סכום</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תקופה</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר תקופה" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">יומי</SelectItem>
                          <SelectItem value="weekly">שבועי</SelectItem>
                          <SelectItem value="monthly">חודשי</SelectItem>
                          <SelectItem value="yearly">שנתי</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit">הוסף תקציב</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
        {budgetStatus.map(budget => {
          const percentage = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
          const remaining = budget.amount - budget.spent;
          
          return (
            <Card key={budget.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between">
                  <span>{getCategoryNameById(budget.category)}</span>
                  <span className="text-sm text-muted-foreground">{getPeriodName(budget.period)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={percentage} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>שימוש: {formatCurrency(budget.spent)}</span>
                  <span>מתוך: {formatCurrency(budget.amount)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={percentage >= 100 ? "text-money-expense" : "text-muted-foreground"}>
                    {percentage}% נוצל
                  </span>
                  <span className="text-money-income">
                    נותר: {formatCurrency(remaining)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {budgetStatus.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <p className="text-muted-foreground mb-4">עדיין אין תקציבים. הוסף תקציב חדש כדי להתחיל לעקוב אחר ההוצאות שלך.</p>
            <Button onClick={() => setOpen(true)}>הוסף תקציב</Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BudgetPage;
