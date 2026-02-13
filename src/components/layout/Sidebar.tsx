
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Car,
  Truck,
  Calendar,
  Settings,
  Users,
  X,
  LineChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
}

export function Sidebar({ className, isOpen, setIsOpen, isMobile }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  // Conditionally use location to avoid React Router errors
  const location = { pathname: window.location.pathname };
  
  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/"
    },
    {
      name: "Fleets",
      icon: Users,
      path: "/fleets"
    },
    {
      name: "Vehicles",
      icon: Car,
      path: "/vehicles"
    },
    {
      name: "Jobs",
      icon: Calendar,
      path: "/jobs"
    },
    {
      name: "GPS Processing",
      icon: LineChart,
      path: "/gps-processing"
    },
    {
      name: "Maintenance",
      icon: Truck,
      path: "/maintenance"
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings"
    }
  ];

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, setIsOpen]);

  const sidebarContent = (
    <>
      <div className="p-4 flex items-center justify-between border-b border-border/20">
        {!collapsed && (
          <div className="font-bold text-lg text-primary">FleetVoyager</div>
        )}
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-sidebar-foreground"
                )}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
                {(!collapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/20">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="ml-2">
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-sidebar-foreground/70">Fleet Manager</div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="p-0 w-[240px] bg-sidebar text-sidebar-foreground">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-border/20 transition-all duration-300 flex flex-col h-screen",
        collapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      {sidebarContent}
    </div>
  );
}
