
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import { formatCurrency, getCategoryNameById } from "@/utils/financeUtils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>עסקאות אחרונות</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>תאריך</TableHead>
              <TableHead>תיאור</TableHead>
              <TableHead>קטגוריה</TableHead>
              <TableHead>אמצעי תשלום</TableHead>
              <TableHead className="text-left">סכום</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
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
                <TableCell className={`text-left ${transaction.type === "income" ? "text-money-income" : "text-money-expense"}`}>
                  {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
