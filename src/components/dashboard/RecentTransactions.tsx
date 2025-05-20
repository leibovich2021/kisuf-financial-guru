
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
    <Card className="col-span-2 shadow-sm border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary">עסקאות אחרונות</CardTitle>
      </CardHeader>
      <CardContent className="px-3">
        <div className="max-h-[350px] overflow-y-auto rounded-md">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead className="font-medium">תאריך</TableHead>
                <TableHead className="font-medium">תיאור</TableHead>
                <TableHead className="font-medium">קטגוריה</TableHead>
                <TableHead className="font-medium">אמצעי תשלום</TableHead>
                <TableHead className="text-left font-medium">סכום</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/30">
                  <TableCell className="py-2">{new Date(transaction.date).toLocaleDateString('he-IL')}</TableCell>
                  <TableCell className="py-2">{transaction.description}</TableCell>
                  <TableCell className="py-2">{getCategoryNameById(transaction.category)}</TableCell>
                  <TableCell className="py-2">
                    {transaction.paymentMethod === "cash" && "מזומן"}
                    {transaction.paymentMethod === "credit" && "אשראי"}
                    {transaction.paymentMethod === "bankTransfer" && "העברה בנקאית"}
                    {transaction.paymentMethod === "other" && "אחר"}
                  </TableCell>
                  <TableCell className={`text-left font-medium py-2 ${transaction.type === "income" ? "text-money-income" : "text-money-expense"}`}>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </TableCell>
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
