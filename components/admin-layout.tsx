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
import { X, Menu, Bell, Home, LogOut, Users, Calendar } from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useResponsiveBreakpoints } from "@/lib/hooks";
import { authClient } from "@/lib/auth/client";
import { useToast } from "@/components/ui/toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", id: "dashboard", icon: Home },
  { name: "Bookings", id: "bookings", icon: Calendar },
  { name: "Customers", id: "customers", icon: Users, href: "/admin/customers" },
  { name: "Users", id: "users", icon: Users, href: "/admin/manage/users" },
];

interface SidebarContentProps {
  currentPage: string;
  isMobile: boolean;
  isTablet: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userEmail?: string;
  userName?: string;
}

const SidebarContent = ({
  currentPage,
  isMobile,
  isTablet,
  sidebarOpen,
  setSidebarOpen,
  userEmail,
  userName,
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
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-xl font-bold">Airport Concierge</h1>
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

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const href = (item as any).href ? (item as any).href : `/admin/${item.id}`;
          return (
            <Link key={item.id} href={href}>
              <Button
                variant={currentPage === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {userEmail || "No email"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { isMobile, isTablet, isDesktop } = useResponsiveBreakpoints();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const toast = useToast();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    fetchUser();
  }, []);

  const getCurrentPage = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length >= 2 && segments[0] === "admin") {
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
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
          <SidebarContent
            currentPage={currentPage}
            isMobile={isMobile}
            isTablet={isTablet}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userEmail={user?.email}
            userName={user?.name || user?.email?.split("@")[0]}
          />
        </div>
      )}

      {isTablet && (
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            currentPage={currentPage}
            isMobile={isMobile}
            isTablet={isTablet}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userEmail={user?.email}
            userName={user?.name || user?.email?.split("@")[0]}
          />
        </div>
      )}

      <div className={`${isDesktop ? "ml-64" : ""} ${isTablet && sidebarOpen ? "ml-64" : ""}`}>
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
