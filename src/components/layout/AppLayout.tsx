
import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Calculator, Wallet, BarChart3, Settings, CreditCard, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface AppLayoutProps {
  children: ReactNode;
}

const AppSidebarContent = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const menuItems = [
    { path: "/dashboard", name: "לוח מחוונים", icon: BarChart3 },
    { path: "/transactions", name: "עסקאות", icon: Wallet },
    { path: "/budget", name: "תקציב", icon: Calculator },
    { path: "/credit", name: "אשראי", icon: CreditCard },
    { path: "/settings", name: "הגדרות", icon: Settings },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  const currentGroup = menuItems.find(item => isActive(item.path))?.name;
  
  const handleLogout = () => {
    // מחיקת פרטי ההתחברות
    localStorage.removeItem("isLoggedIn");
    
    // הצגת הודעה
    toast({
      title: "התנתקת מהמערכת",
      description: "מועבר לדף ההתחברות",
    });
    
    // ניווט לדף ההתחברות
    navigate("/");
  };
  
  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 shadow-md border-accent/20`} collapsible="offcanvas">
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent className="pb-6">
        <div className={`flex h-16 items-center px-4 font-semibold ${!collapsed ? "justify-center" : ""}`}>
          {!collapsed ? (
            <span className="text-lg text-primary font-bold">ניהול כספים</span>
          ) : (
            <Wallet className="h-6 w-6 text-primary" />
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={`flex items-center gap-3 rounded-md py-2.5 px-3 my-1 mx-2 transition-all ${
                        isActive(item.path) 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <div className="mt-auto pt-4">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button 
                      variant="ghost"
                      className="w-full flex justify-start items-center gap-3 rounded-md py-2.5 px-3 my-1 mx-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      {!collapsed && <span>התנתקות</span>}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background flex">
        <AppSidebarContent />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-accent/20 px-4 shadow-sm glass sticky top-0 z-10">
            <SidebarTrigger className="ml-2" />
            <h1 className="text-primary font-bold text-xl">ניהול הכספים שלי</h1>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 page-container">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
