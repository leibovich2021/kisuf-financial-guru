
import { useState } from "react";
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

const formSchema = z.object({
  name: z.string().nonempty({ message: "שם משתמש נדרש" }),
  currency: z.string().nonempty({ message: "יש לבחור מטבע" }),
  monthlySavingsGoal: z.coerce.number().nonnegative({ message: "יש להזין מספר חיובי" }),
});

const SettingsPage = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "משתמש",
      currency: "ILS",
      monthlySavingsGoal: 2000,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      toast({
        title: "ההגדרות נשמרו בהצלחה",
        description: "הגדרות היישום עודכנו",
      });
      setIsSaving(false);
    }, 1000);
    
    console.log(values);
  }

  return (
    <AppLayout>
      <PageHeader heading="הגדרות" subheading="התאם את הגדרות היישום" />
      
      <div className="mt-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>הגדרות משתמש</CardTitle>
            <CardDescription>עדכן את הגדרות היישום שלך</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
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
                  name="monthlySavingsGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>יעד חיסכון חודשי</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        סכום החיסכון שברצונך להגיע אליו בכל חודש
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "שומר..." : "שמור הגדרות"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
