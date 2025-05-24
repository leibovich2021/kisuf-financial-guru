
import StatisticsCard from "./StatisticsCard";

interface DashboardStatisticsProps {
  summary: {
    totalIncome: number;
    totalExpense: number;
    totalSaved: number;
  };
}

const DashboardStatistics = ({ summary }: DashboardStatisticsProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 animate-fade-in">
      <StatisticsCard
        title="הכנסות החודש"
        currentValue={summary.totalIncome}
        previousValue={4200}
        target={6000}
        period="החודש"
        type="income"
      />
      <StatisticsCard
        title="הוצאות החודש"
        currentValue={summary.totalExpense}
        previousValue={3800}
        target={4000}
        period="החודש"
        type="expense"
      />
      <StatisticsCard
        title="חיסכון החודש"
        currentValue={summary.totalSaved}
        previousValue={400}
        target={2000}
        period="החודש"
        type="saving"
      />
    </div>
  );
};

export default DashboardStatistics;
