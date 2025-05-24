
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { format, startOfMonth, addMonths, subMonths } from "date-fns";
import { he } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { MonthlyData, CalendarState } from "@/types/calendar";
import { Transaction, Budget } from "@/types";
import { calculateSummary, getBudgetStatus } from "@/utils/financeUtils";

interface CalendarManagerProps {
  transactions: Transaction[];
  budgets: Budget[];
  onMonthChange: (month: string, monthlyData: MonthlyData) => void;
}

const CalendarManager = ({ transactions, budgets, onMonthChange }: CalendarManagerProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarState, setCalendarState] = useState<CalendarState>(() => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const monthlyData: MonthlyData = {
      month: currentMonth,
      transactions,
      budgets,
      summary: calculateSummary(transactions)
    };
    
    return {
      currentMonth,
      monthlyData: {
        [currentMonth]: monthlyData
      }
    };
  });

  const getCurrentMonthData = (): MonthlyData => {
    return calendarState.monthlyData[calendarState.currentMonth] || {
      month: calendarState.currentMonth,
      transactions: [],
      budgets: [],
      summary: { totalIncome: 0, totalExpense: 0, totalSaved: 0, creditDebt: 0, cashSpent: 0 }
    };
  };

  const switchToMonth = (monthStr: string) => {
    // אם החודש לא קיים, צור נתונים ריקים עבורו
    if (!calendarState.monthlyData[monthStr]) {
      const newMonthData: MonthlyData = {
        month: monthStr,
        transactions: [],
        budgets: budgets.map(b => ({ ...b, spent: 0 })),
        summary: { totalIncome: 0, totalExpense: 0, totalSaved: 0, creditDebt: 0, cashSpent: 0 }
      };
      
      setCalendarState(prev => ({
        currentMonth: monthStr,
        monthlyData: {
          ...prev.monthlyData,
          [monthStr]: newMonthData
        }
      }));
      
      onMonthChange(monthStr, newMonthData);
    } else {
      setCalendarState(prev => ({
        ...prev,
        currentMonth: monthStr
      }));
      
      onMonthChange(monthStr, calendarState.monthlyData[monthStr]);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentDate = new Date(calendarState.currentMonth + '-01');
    const newDate = direction === 'prev' 
      ? subMonths(currentDate, 1) 
      : addMonths(currentDate, 1);
    const newMonthStr = format(newDate, 'yyyy-MM');
    
    switchToMonth(newMonthStr);
  };

  const onCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const monthStr = format(date, 'yyyy-MM');
      switchToMonth(monthStr);
      setCalendarOpen(false);
    }
  };

  // עדכן את הנתונים של החודש הנוכחי כשמתקבלים עסקאות חדשות
  useEffect(() => {
    const currentMonthData = getCurrentMonthData();
    const updatedData: MonthlyData = {
      ...currentMonthData,
      transactions,
      budgets: getBudgetStatus(budgets, transactions),
      summary: calculateSummary(transactions)
    };
    
    setCalendarState(prev => ({
      ...prev,
      monthlyData: {
        ...prev.monthlyData,
        [prev.currentMonth]: updatedData
      }
    }));
  }, [transactions, budgets]);

  const currentMonthData = getCurrentMonthData();
  const currentDate = new Date(calendarState.currentMonth + '-01');
  const hasData = currentMonthData.transactions.length > 0;

  return (
    <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-card dark:to-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-primary">ניהול חודשי</CardTitle>
              <p className="text-sm text-muted-foreground">נווט בין חודשים ועקב אחר הנתונים</p>
            </div>
          </div>
          
          <Badge variant={hasData ? "default" : "secondary"} className="ml-2">
            {hasData ? `${currentMonthData.transactions.length} עסקאות` : "ללא נתונים"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* ניווט חודשי */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-card/60 border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="font-semibold text-lg hover:bg-primary/10"
              >
                {format(currentDate, 'MMMM yyyy', { locale: he })}
                <CalendarIcon className="mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={onCalendarSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* סיכום החודש */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">הכנסות</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              ₪{currentMonthData.summary.totalIncome.toLocaleString()}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">הוצאות</span>
            </div>
            <div className="text-lg font-bold text-red-600">
              ₪{currentMonthData.summary.totalExpense.toLocaleString()}
            </div>
          </div>
        </div>

        {/* חודשים זמינים */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">חודשים עם נתונים:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.keys(calendarState.monthlyData)
              .sort()
              .reverse()
              .slice(0, 6)
              .map(month => {
                const monthData = calendarState.monthlyData[month];
                const isActive = month === calendarState.currentMonth;
                const monthDate = new Date(month + '-01');
                
                return (
                  <Button
                    key={month}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchToMonth(month)}
                    className="text-xs"
                  >
                    {format(monthDate, 'MMM yy', { locale: he })}
                    {monthData.transactions.length > 0 && (
                      <Badge variant="secondary" className="mr-1 h-4 text-xs">
                        {monthData.transactions.length}
                      </Badge>
                    )}
                  </Button>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarManager;
