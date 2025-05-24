
import { Budget } from "@/types";
import { BudgetTableRow } from "./BudgetTableRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BudgetTableProps {
  budgets: Budget[];
}

export const BudgetTable = ({ budgets }: BudgetTableProps) => {
  return (
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
          {budgets.map(budget => (
            <BudgetTableRow key={budget.id} budget={budget} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
