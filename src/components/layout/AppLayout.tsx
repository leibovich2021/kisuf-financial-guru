
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { Calculator, Wallet, BarChart3, Settings, CreditCard } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppSidebarContent = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  
  const menuItems = [
    { path: "/", name: "לוח מחוונים", icon: BarChart3 },
    { path: "/transactions", name: "עסקאות", icon: Wallet },
    { path: "/budget", name: "תקציב", icon: Calculator },
    { path: "/credit", name: "אשראי", icon: CreditCard },
    { path: "/settings", name: "הגדרות", icon: Settings },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";
  
  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="offcanvas">
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent>
        <div className="flex h-14 items-center px-4 font-semibold">
          {!collapsed && <span>ניהול כספים</span>}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className={`flex items-center gap-2 rounded-md p-2 ${isActive(item.path) ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}`}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
      <header className="h-12 flex items-center border-b">
        <SidebarTrigger className="ml-2" />
      </header>
      
      <div className="flex min-h-screen w-full">
        <AppSidebarContent />
        
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

