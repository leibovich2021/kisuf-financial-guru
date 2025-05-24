
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Transaction } from "@/types";
import { formatCurrency, getCategoryNameById } from "@/utils/financeUtils";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onDeleteTransaction?: (transactionId: string) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  onDeleteTransaction 
}) => {
  const { toast } = useToast();

  const handleDelete = (transactionId: string) => {
    if (onDeleteTransaction) {
      const transaction = transactions.find(t => t.id === transactionId);
      onDeleteTransaction(transactionId);
      
      toast({
        title: "עסקה נמחקה",
        description: `העסקה "${transaction?.description}" נמחקה בהצלחה`,
      });
    }
  };

  return (
    <Card className="col-span-2 shadow-md border-0 rounded-xl bg-gradient-to-br from-white to-accent/5 dark:from-card dark:to-background hover:shadow-lg transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary">עסקאות אחרונות</CardTitle>
      </CardHeader>
      <CardContent className="px-3">
        <div className="max-h-[400px] overflow-y-auto rounded-lg">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 rounded-t-lg">
              <TableRow>
                <TableHead className="font-semibold">תאריך</TableHead>
                <TableHead className="font-semibold">תיאור</TableHead>
                <TableHead className="font-semibold">קטגוריה</TableHead>
                <TableHead className="font-semibold">אמצעי תשלום</TableHead>
                <TableHead className="text-left font-semibold">סכום</TableHead>
                {onDeleteTransaction && (
                  <TableHead className="text-center font-semibold w-16">פעולות</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="py-2.5">{new Date(transaction.date).toLocaleDateString('he-IL')}</TableCell>
                  <TableCell className="py-2.5 max-w-[150px] truncate">{transaction.description}</TableCell>
                  <TableCell className="py-2.5">{getCategoryNameById(transaction.category)}</TableCell>
                  <TableCell className="py-2.5">
                    {transaction.paymentMethod === "cash" && "מזומן"}
                    {transaction.paymentMethod === "credit" && "אשראי"}
                    {transaction.paymentMethod === "bankTransfer" && "העברה בנקאית"}
                    {transaction.paymentMethod === "other" && "אחר"}
                  </TableCell>
                  <TableCell className={`text-left font-medium py-2.5 ${transaction.type === "income" ? "text-money-income" : "text-money-expense"}`}>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </TableCell>
                  {onDeleteTransaction && (
                    <TableCell className="text-center py-2.5">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>מחיקת עסקה</AlertDialogTitle>
                            <AlertDialogDescription>
                              האם אתה בטוח שברצונך למחוק את העסקה "{transaction.description}"?
                              פעולה זו לא ניתנת לביטול.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>ביטול</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(transaction.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              מחק
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
