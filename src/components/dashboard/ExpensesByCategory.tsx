
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
    <Card className="shadow-md border-0 rounded-xl bg-gradient-to-br from-white to-accent/10 dark:from-card dark:to-background hover:shadow-lg transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary">הוצאות לפי קטגוריה</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex justify-center items-center">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(Number(value))} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted-foreground py-10">אין מספיק נתונים להצגה</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategory;
