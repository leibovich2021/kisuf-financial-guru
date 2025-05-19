
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { AppLayout } from "@/components/layout/AppLayout";
import { transactions as initialTransactions } from "@/data/mockData";
import { formatCurrency, getCategoryNameById } from "@/utils/financeUtils";
import { Transaction } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CreditPage = () => {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  
  const creditTransactions = transactions.filter(
    t => t.type === "expense" && t.paymentMethod === "credit"
  );
  
  const totalCredit = creditTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <AppLayout>
      <PageHeader heading="מעקב אשראי" subheading="עקוב אחר ההוצאות באשראי" />
      
      <div className="mt-6">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>סיכום אשראי</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-money-expense">
              סך חיובי אשראי: {formatCurrency(totalCredit)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>פירוט עסקאות אשראי</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>תאריך</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead className="text-left">סכום</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      אין עסקאות אשראי
                    </TableCell>
                  </TableRow>
                ) : (
                  creditTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{getCategoryNameById(transaction.category)}</TableCell>
                      <TableCell className="text-left text-money-expense">
                        {formatCurrency(transaction.amount)}
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

export default CreditPage;
