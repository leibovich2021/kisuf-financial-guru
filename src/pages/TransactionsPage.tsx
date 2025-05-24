
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { AppLayout } from "@/components/layout/AppLayout";
import { transactions as initialTransactions } from "@/data/mockData";
import TransactionForm from "@/components/transactions/TransactionForm";
import { Transaction } from "@/types";
import { formatCurrency, getCategoryNameById } from "@/utils/financeUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filter, setFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const { toast } = useToast();
  
  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    
    toast({
      title: "עסקה נמחקה",
      description: `העסקה "${transaction?.description}" נמחקה בהצלחה`,
    });
  };
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = 
      transaction.description.toLowerCase().includes(filter.toLowerCase()) ||
      getCategoryNameById(transaction.category).toLowerCase().includes(filter.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || 
      transaction.type === typeFilter;
    
    const matchesPayment = 
      paymentFilter === "all" || 
      transaction.paymentMethod === paymentFilter;
    
    return matchesFilter && matchesType && matchesPayment;
  });
  
  return (
    <AppLayout>
      <PageHeader heading="עסקאות" subheading="צפייה וניהול של כל העסקאות שלך">
        <TransactionForm onAddTransaction={handleAddTransaction} />
      </PageHeader>
      
      <div className="mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input 
                  placeholder="חפש עסקאות..." 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)} 
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="סוג עסקה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הכל</SelectItem>
                    <SelectItem value="income">הכנסות</SelectItem>
                    <SelectItem value="expense">הוצאות</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="אמצעי תשלום" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הכל</SelectItem>
                    <SelectItem value="cash">מזומן</SelectItem>
                    <SelectItem value="credit">אשראי</SelectItem>
                    <SelectItem value="bankTransfer">העברה בנקאית</SelectItem>
                    <SelectItem value="other">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>תאריך</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead>אמצעי תשלום</TableHead>
                  <TableHead>סוג</TableHead>
                  <TableHead className="text-left">סכום</TableHead>
                  <TableHead className="text-center">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      לא נמצאו עסקאות
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{getCategoryNameById(transaction.category)}</TableCell>
                      <TableCell>
                        {transaction.paymentMethod === "cash" && "מזומן"}
                        {transaction.paymentMethod === "credit" && "אשראי"}
                        {transaction.paymentMethod === "bankTransfer" && "העברה בנקאית"}
                        {transaction.paymentMethod === "other" && "אחר"}
                      </TableCell>
                      <TableCell>
                        {transaction.type === "income" ? "הכנסה" : "הוצאה"}
                      </TableCell>
                      <TableCell className={`text-left ${transaction.type === "income" ? "text-money-income" : "text-money-expense"}`}>
                        {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
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
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                מחק
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TransactionsPage;
