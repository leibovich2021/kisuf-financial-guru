
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/ui/page-header";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FinancialProvider, useFinancialContext } from "@/contexts/FinancialContext";

const formSchema = z.object({
  displayName: z.string().nonempty({ message: "שם משתמש נדרש" }),
  currency: z.string().nonempty({ message: "יש לבחור מטבע" }),
  monthlyIncomeGoal: z.coerce.number().nonnegative({ message: "יש להזין מספר חיובי" }),
  monthlyExpenseLimit: z.coerce.number().nonnegative({ message: "יש להזין מספר חיובי" }),
  monthlySavingsGoal: z.coerce.number().nonnegative({ message: "יש להזין מספר חיובי" }),
});

const SettingsContent = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useFinancialContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });

  // עדכון הטופס כשההגדרות משתנות
  useEffect(() => {
    form.reset(settings);
  }, [settings, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateSettings(values);
    
    toast({
      title: "ההגדרות נשמרו בהצלחה",
      description: "הגדרות היישום עודכנו ויסונכרנו עם כל הנתונים",
    });
  }

  return (
    <>
      <PageHeader heading="הגדרות" subheading="התאם את הגדרות היישום" />
      
      <div className="mt-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>הגדרות משתמש</CardTitle>
            <CardDescription>עדכן את הגדרות היישום שלך - השינויים יתעדכנו אוטומטית בכל המערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם משתמש</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        השם שיוצג בחלקים שונים של היישום
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>מטבע ברירת מחדל</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        המטבע שישמש להצגת סכומים (לדוגמה: ILS, USD, EUR)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="monthlyIncomeGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>יעד הכנסה חודשי</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        יעד ההכנסה החודשית - יסונכרן עם ניהול הכספים
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyExpenseLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>מגבלת הוצאות חודשית</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        מגבלת ההוצאות החודשית - יסונכרן עם ניהול הכספים
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="monthlySavingsGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>יעד חיסכון חודשי</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        סכום החיסכון שברצונך להגיע אליו בכל חודש - יסונכרן עם כל החסכונות
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit">
                  שמור הגדרות
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const SettingsPage = () => {
  return (
    <FinancialProvider>
      <AppLayout>
        <SettingsContent />
      </AppLayout>
    </FinancialProvider>
  );
};

export default SettingsPage;
