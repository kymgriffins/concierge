"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";
import {
  X,
  Menu,
  Bell,
  Home,
  LogOut,
  Users,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plane,
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useResponsiveBreakpoints } from "@/lib/hooks";
import { authClient } from "@/lib/auth/client";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", id: "dashboard", icon: Home },
  { name: "Bookings", id: "bookings", icon: Calendar },
  { name: "Services", id: "services", icon: Settings, href: "/admin/manage/services" },
  { name: "Users", id: "users", icon: Users, href: "/admin/manage/users" },
];

interface NotificationCenterProps {
  dashboardStats: {
    totalBookings?: number;
    pendingBookings?: number;
    todayBookings?: number;
    monthlyEarnings?: number;
    completedBookings?: number;
    totalEarnings?: number;
    customersServiced?: number;
    completionPercentage?: number;
  };
  isCollapsed: boolean;
}

const NotificationCenter = ({ dashboardStats, isCollapsed }: NotificationCenterProps) => {
  const [currentNotification, setCurrentNotification] = useState(0);

  const notifications = [
    {
      icon: Calendar,
      color: "text-blue-600",
      label: "Total Bookings",
      value: dashboardStats.totalBookings || 0,
      unit: ""
    },
    {
      icon: Clock,
      color: "text-orange-600",
      label: "Active Bookings",
      value: dashboardStats.pendingBookings || 0,
      unit: ""
    },
    {
      icon: CheckCircle,
      color: "text-green-600",
      label: "Completed",
      value: dashboardStats.completedBookings || 0,
      unit: ""
    },
    {
      icon: DollarSign,
      color: "text-green-600",
      label: "Monthly Revenue",
      value: dashboardStats.monthlyEarnings || 0,
      unit: "$"
    },
    {
      icon: Users,
      color: "text-purple-600",
      label: "Customers",
      value: dashboardStats.customersServiced || 0,
      unit: ""
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length);
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [notifications.length]);

  const current = notifications[currentNotification];
  const Icon = current.icon;

  return (
    <div className={cn(
      "flex items-center transition-all duration-500 ease-in-out",
      isCollapsed ? "justify-center" : "justify-between"
    )}>
      <Icon className={cn(
        "transition-all duration-200",
        current.color,
        isCollapsed ? "h-4 w-4" : "h-3 w-3 mr-2"
      )} />
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <span className="text-xs text-muted-foreground truncate block">
            {current.label}
          </span>
        </div>
      )}
      <span className={cn(
        "font-semibold transition-all duration-200",
        isCollapsed ? "text-xs" : "text-sm"
      )}>
        {current.unit}{current.value.toLocaleString()}
      </span>
    </div>
  );
};

interface SidebarContentProps {
  currentPage: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  userEmail?: string;
  userName?: string;
  dashboardStats?: {
    totalBookings?: number;
    pendingBookings?: number;
    todayBookings?: number;
    monthlyEarnings?: number;
    completedBookings?: number;
    totalEarnings?: number;
    customersServiced?: number;
    completionPercentage?: number;
  } | null;
}

const SidebarContent = ({
  currentPage,
  isMobile,
  isTablet,
  isDesktop,
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
  userEmail,
  userName,
  dashboardStats,
}: SidebarContentProps) => {
  const getInitials = () => {
    if (userName) {
      return userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    if (userEmail) return userEmail.substring(0, 2).toUpperCase();
    return "U";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with collapse button */}
      <div className={cn(
        "flex items-center justify-between border-b transition-all duration-300",
        isCollapsed ? "px-3 py-4" : "p-6"
      )}>
        {isCollapsed ? (
          <div className="flex items-center justify-center">
            <Plane className="h-6 w-6 text-primary" />
          </div>
        ) : (
          <h1 className="text-xl font-bold">Airport Concierge</h1>
        )}

        <div className="flex items-center gap-2">
          {/* Collapse/Expand button for desktop/tablet */}
          {(isDesktop || isTablet) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="touch-manipulation min-h-[44px] min-w-[44px] hover:bg-muted"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Close button for mobile/tablet overlay */}
          {(isMobile || isTablet) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="touch-manipulation min-h-[44px] min-w-[44px]"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 space-y-1 transition-all duration-300",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const href = (item as any).href ? (item as any).href : `/admin/${item.id}`;
          const isActive = currentPage === item.id;

          return (
            <Link key={item.id} href={href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full transition-all duration-200 hover:bg-muted",
                  isCollapsed ? "justify-center px-3 py-3" : "justify-start",
                  isActive && isCollapsed ? "bg-primary text-primary-foreground hover:bg-primary hover:text-black" : "",
                  isActive && !isCollapsed ? "hover:text-black hover:bg-primary/10" : ""
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={cn(
                  "transition-all duration-200",
                  isCollapsed ? "h-5 w-5" : "mr-3 h-4 w-4"
                )} />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Notification Center */}
      {dashboardStats && (
        <div className={cn(
          "border-t bg-muted/30 transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              System Status
            </h3>
          )}
          <NotificationCenter
            dashboardStats={dashboardStats}
            isCollapsed={isCollapsed}
          />
        </div>
      )}

      {/* User section */}
      <div className={cn(
        "border-t transition-all duration-300",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "flex items-center transition-all duration-300",
          isCollapsed ? "justify-center" : "space-x-3"
        )}>
          <Avatar className={cn(
            "transition-all duration-200",
            isCollapsed ? "h-6 w-6" : "h-8 w-8"
          )}>
            <AvatarFallback className={cn(
              "transition-all duration-200",
              isCollapsed ? "text-xs" : ""
            )}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail || "No email"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { isMobile, isTablet, isDesktop } = useResponsiveBreakpoints();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const toast = useToast();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<{
    totalBookings?: number;
    pendingBookings?: number;
    todayBookings?: number;
    monthlyEarnings?: number;
    completedBookings?: number;
    totalEarnings?: number;
    customersServiced?: number;
    completionPercentage?: number;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authClient.getSession();
        setUser((session as any)?.data?.user || (session as any)?.user || null);
      } catch (error) {
        console.error("Failed to get session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/dashboard-stats');
        if (response.ok) {
          const data = await response.json();
          setDashboardStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchUser();
    fetchDashboardStats();
  }, []);

  const getCurrentPage = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length >= 2 && segments[0] === "admin") {
      // Handle manage routes
      if (segments[1] === "manage") {
        if (segments[2] === "services") return "services";
        if (segments[2] === "users") return "users";
        if (segments[2] === "bookings") return "bookings";
      }

      const lastSegment = segments[segments.length - 1];
      if (!navigation.some((nav) => nav.id === lastSegment)) return segments[1];
      return lastSegment;
    }
    return segments.pop() || "dashboard";
  };

  const currentPage = getCurrentPage(pathname);

  return (
    <div className="min-h-screen bg-background">
      {isDesktop && (
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}>
          <SidebarContent
            currentPage={currentPage}
            isMobile={isMobile}
            isTablet={isTablet}
            isDesktop={isDesktop}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            userEmail={user?.email}
            userName={user?.name || user?.email?.split("@")[0]}
            dashboardStats={dashboardStats}
          />
        </div>
      )}

      {isTablet && (
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-card border-r transform transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <SidebarContent
            currentPage={currentPage}
            isMobile={isMobile}
            isTablet={isTablet}
            isDesktop={isDesktop}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            userEmail={user?.email}
            userName={user?.name || user?.email?.split("@")[0]}
            dashboardStats={dashboardStats}
          />
        </div>
      )}

      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isDesktop ? (isCollapsed ? "ml-16" : "ml-64") : "",
        isTablet && sidebarOpen ? (isCollapsed ? "ml-16" : "ml-64") : ""
      )}>
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              {!isDesktop && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="touch-manipulation min-h-[44px] min-w-[44px]"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}

              <div className="flex items-center">
                {isMobile ? <h1 className="text-lg font-bold">AC</h1> : <h1 className="text-lg font-semibold capitalize">{currentPage}</h1>}
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative touch-manipulation min-h-[44px] min-w-[44px]">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full touch-manipulation min-h-[44px] min-w-[44px]">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.name ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() : user?.email ? user.email.substring(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="p-3">
                    <div className="text-sm font-medium">{user?.name || user?.email || "Not signed in"}</div>
                    <div className="text-xs text-muted-foreground">{user?.email || "No email"}</div>
                  </div>
                  <Separator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings">Profile</Link>
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem
                    onClick={async () => {
                      const { authClient } = await import("@/lib/auth/client");
                      await authClient.signOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex">
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
