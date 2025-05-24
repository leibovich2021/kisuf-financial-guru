import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { AppLayout } from "@/components/layout/AppLayout";
import { categories } from "@/data/mockData";
import { getBudgetStatus, formatCurrency, getCategoryNameById } from "@/utils/financeUtils";
import { Budget } from "@/types";
import { useFinancialContext } from "@/contexts/FinancialContext";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  category: z.string().nonempty({ message: "יש לבחור קטגוריה" }),
  amount: z.coerce.number().positive({ message: "הסכום חייב להיות חיובי" }),
  period: z.enum(["daily", "weekly", "monthly", "yearly"], { required_error: "יש לבחור תקופה" }),
});

const BudgetPage = () => {
  const { budgets, transactions, addBudget, updateBudget, deleteBudget } = useFinancialContext();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      period: "monthly",
    },
  });

  const budgetStatus = getBudgetStatus(budgets, transactions);

  const availableCategories = categories
    .filter(category => category.type === "expense")
    .filter(category => !budgets.some(budget => budget.category === category.id));

  const handleAddBudget = (values: z.infer<typeof formSchema>) => {
    const newBudget = {
      category: values.category,
      amount: values.amount,
      spent: 0,
      period: values.period,
    };

    addBudget(newBudget);
    toast({
      title: "תקציב נוסף בהצלחה",
      description: `תקציב עבור ${getCategoryNameById(values.category)} נוסף`,
    });
    form.reset();
    setOpen(false);
  };

  const handleDeleteBudget = (budgetId: string) => {
    deleteBudget(budgetId);
    toast({
      title: "תקציב נמחק",
      description: "התקציב נמחק מהמערכת",
    });
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

  const calculateDailyBudget = (budget: Budget) => {
    switch (budget.period) {
      case "daily":
        return budget.amount;
      case "weekly":
        return budget.amount / 7;
      case "monthly":
        return budget.amount / 30;
      case "yearly":
        return budget.amount / 365;
      default:
        return budget.amount / 30;
    }
  };

  const calculateHourlyBudget = (budget: Budget) => {
    const dailyBudget = calculateDailyBudget(budget);
    return dailyBudget / 24;
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
      
      <div className="mt-6">
        {budgetStatus.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">קטגוריה</TableHead>
                  <TableHead className="text-right">תקופה</TableHead>
                  <TableHead className="text-right">תקציב מקורי</TableHead>
                  <TableHead className="text-right">תקציב יומי</TableHead>
                  <TableHead className="text-right">תקציב שעתי</TableHead>
                  <TableHead className="text-right">שימוש</TableHead>
                  <TableHead className="text-right">נותר</TableHead>
                  <TableHead className="text-right">אחוז השימוש</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetStatus.map(budget => {
                  const percentage = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
                  const remaining = budget.amount - budget.spent;
                  const dailyBudget = calculateDailyBudget(budget);
                  const hourlyBudget = calculateHourlyBudget(budget);
                  
                  return (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium text-right">
                        {getCategoryNameById(budget.category)}
                      </TableCell>
                      <TableCell className="text-right">
                        {getPeriodName(budget.period)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(budget.amount)}
                      </TableCell>
                      <TableCell className="text-right text-blue-600 font-medium">
                        {formatCurrency(dailyBudget)}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {formatCurrency(hourlyBudget)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(budget.spent)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-money-income">
                          {formatCurrency(remaining)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="h-2 flex-1" />
                          <span className={percentage >= 100 ? "text-money-expense" : "text-muted-foreground"}>
                            {percentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          מחק
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">עדיין אין תקציבים. הוסף תקציב חדש כדי להתחיל לעקוב אחר ההוצאות שלך.</p>
            <Button onClick={() => setOpen(true)}>הוסף תקציב</Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BudgetPage;
