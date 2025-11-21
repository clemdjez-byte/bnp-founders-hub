import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  PieChart,
  Diamond,
  CreditCard,
  TrendingUp,
  Rewind,
  FastForward,
  Phone,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { id: "dashboard", label: "Net Worth", icon: PieChart, path: "/" },
  { id: "assets", label: "Assets", icon: Diamond, path: "/assets" },
  { id: "debts", label: "Debts", icon: CreditCard, path: "/debts" },
  { id: "invest", label: "Invest", icon: TrendingUp, path: "/invest" },
  { id: "recap", label: "AI Advisor", icon: Rewind, path: "/recap" },
  { id: "fast-forward", label: "Fast Forward", icon: FastForward, path: "/fast-forward" },
  { id: "contact", label: "Contact Banker", icon: Phone, path: "/contact" },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-lg font-semibold text-sidebar-primary-foreground">
            BNP Private Founders
          </h1>
        </div>

        <SidebarGroup>
          <SidebarGroupContent className="px-3 py-4">
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.path}
                        end
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {open && <span className="font-medium">{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
