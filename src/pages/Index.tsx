
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards";
import DashboardStatistics from "@/components/dashboard/DashboardStatistics";
import DashboardContent from "@/components/dashboard/DashboardContent";
import FinancialManagement from "@/components/dashboard/FinancialManagement";
import CalendarManager from "@/components/dashboard/CalendarManager";
import QuickActions from "@/components/dashboard/QuickActions";
import { AppLayout } from "@/components/layout/AppLayout";
import { FinancialProvider } from "@/contexts/FinancialContext";
import DashboardContainer from "@/components/dashboard/DashboardContainer";

const DashboardPage = () => {
  return (
    <FinancialProvider>
      <AppLayout>
        <DashboardContainer />
      </AppLayout>
    </FinancialProvider>
  );
};

export default DashboardPage;
