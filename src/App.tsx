
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserSelectionPage from "./pages/UserSelectionPage";
import Index from "./pages/Index";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetPage from "./pages/BudgetPage";
import CreditPage from "./pages/CreditPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { userService } from "./services/userService";

const queryClient = new QueryClient();

// רכיב מגן שבודק האם המשתמש מחובר
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = userService.getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/users" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // בדוק האם יש משתמש מחובר
    const checkAuth = () => {
      const currentUser = userService.getCurrentUser();
      setIsAuthenticated(!!currentUser);
    };
    
    checkAuth();
    
    // האזן לשינויים ב-localStorage
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* הפניה מהדף הבית לבחירת משתמש */}
            <Route path="/" element={<Navigate to="/users" replace />} />
            
            {/* דף בחירת משתמש */}
            <Route path="/users" element={<UserSelectionPage />} />
            
            {/* דף התחברות ישן - נשאיר לתאימות אחורה */}
            <Route path="/login" element={<Navigate to="/users" replace />} />
            
            {/* דפים מוגנים */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <ProtectedRoute>
                  <BudgetPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credit"
              element={
                <ProtectedRoute>
                  <CreditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
