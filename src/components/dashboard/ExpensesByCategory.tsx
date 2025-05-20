
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import { getTransactionsByCategory } from "@/utils/financeUtils";

interface ExpensesByCategoryProps {
  transactions: Transaction[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981', '#a855f7', '#f43f5e', '#84cc16'];

const ExpensesByCategory: React.FC<ExpensesByCategoryProps> = ({ transactions }) => {
  const expenseTransactions = transactions.filter(t => t.type === "expense");
  const expensesByCategory = getTransactionsByCategory(expenseTransactions);
  
  const data = Object.entries(expensesByCategory).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary">הוצאות לפי קטגוריה</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(Number(value))} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategory;
