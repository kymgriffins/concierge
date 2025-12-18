"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart3,
  Bell,
  Calendar,
  FileText,
  Package,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  X,
  Zap,
  Target
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MockAPI, Agent, Booking, Customer } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { AutoBookingSidebar } from "@/components/auto-booking-sidebar";
import { useResponsiveBreakpoints } from "@/lib/hooks";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", id: "dashboard", icon: Home },
  { name: "Bookings", id: "bookings", icon: Calendar },
  { name: "Booking Assignments", id: "booking-assignments", icon: Target },
    { name: "Conversations", id: "conversations", icon: FileText },
  { name: "Customers", id: "customers", icon: Users },
    { name: "Roster", id: "roster", icon: Calendar },
  { name: "Services", id: "services", icon: Package },
    { name: "Tasks", id: "tasks", icon: FileText },
  { name: "Activity", id: "activity", icon: Bell },
  { name: "Analytics", id: "analytics", icon: BarChart3 },
  { name: "Reports", id: "reports", icon: FileText },
  { name: "Settings", id: "settings", icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { isMobile, isTablet, isDesktop } = useResponsiveBreakpoints();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoBookingSidebarOpen, setAutoBookingSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ bookings: Booking[]; customers: Customer[] }>({ bookings: [], customers: [] });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentUser, setCurrentUser] = useState<Agent | null>(null);
  const toast = useToast();

  const getCurrentPage = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    // Handle dynamic routes like /admin/bookings/[id] -> bookings
    if (segments.length >= 2 && segments[0] === 'admin') {
      const lastSegment = segments[segments.length - 1];
      // If the last segment is not in navigation (dynamic ID), return the parent
      if (!navigation.some(nav => nav.id === lastSegment)) {
        return segments[1]; // Return the parent page like 'bookings'
      }
      return lastSegment;
    }
    return segments.pop() || 'dashboard';
  };

  const currentPage = getCurrentPage(pathname);

  const doSearch = async () => {
    try {
      const [bookings, customers] = await Promise.all([
        MockAPI.searchBookings(query || ''),
        MockAPI.getCustomers(query || '')
      ]);
      setResults({ bookings, customers });
    } catch (err) {
      console.error('Search error', err);
      toast.showToast({ title: 'Search failed', description: String(err), type: 'error' } as any);
    }
  };

  useEffect(() => {
    const init = async () => {
      const a = await MockAPI.getAgents();
      setAgents(a);
      const u = await MockAPI.getCurrentUser();
      setCurrentUser(u);
    };
    init();
  }, []);

  const impersonate = async (agentId: string) => {
    try {
      const agent = (await MockAPI.getAgents()).find((x: Agent) => x.id === agentId);
      if (agent) {
        // login by email to reuse existing login flow
        await MockAPI.login(agent.email, 'pw');
        const u = await MockAPI.getCurrentUser();
        setCurrentUser(u);
        toast.showToast({ title: 'Switched user', description: `Now impersonating ${agent.name}`, type: 'info' } as any);
      }
    } catch (err) {
      console.error('Impersonation failed', err);
      toast.showToast({ title: 'Impersonate failed', description: String(err), type: 'error' } as any);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} href={`/admin/${item.id}`}>
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

      {/* User section */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Waithera</p>
            <p className="text-xs text-muted-foreground truncate">waithera@airport.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop/Tablet Sidebar */}
      {isDesktop && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
          <SidebarContent />
        </div>
      )}

      {isTablet && (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
        </div>
      )}

      {/* Mobile Sidebar Sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <div className={`${isDesktop ? 'ml-64' : ''} ${isTablet && sidebarOpen ? 'ml-64' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              {/* Mobile/Tablet Menu Button */}
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

              {/* Logo - Compact on mobile */}
              <div className="flex items-center">
                {isMobile ? (
                  <h1 className="text-lg font-bold">AC</h1>
                ) : (
                  <h1 className="text-lg font-semibold capitalize">{currentPage}</h1>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - Icon on mobile, full input on larger screens */}
              {isMobile ? (
                <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="touch-manipulation min-h-[44px] min-w-[44px]">
                      <Search className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top" className="h-auto">
                    <div className="flex items-center space-x-2 py-4">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search bookings, customers..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                        className="flex-1"
                        autoFocus
                      />
                      <Button onClick={doSearch} size="sm">Search</Button>
                    </div>
                    {results.bookings.length > 0 || results.customers.length > 0 ? (
                      <div className="space-y-4">
                        {results.bookings.slice(0, 3).map(booking => (
                          <div key={booking.id} className="p-3 border rounded-lg">
                            <p className="font-medium">{booking.passengerName}</p>
                            <p className="text-sm text-muted-foreground">{booking.flightNumber} - {booking.airline}</p>
                          </div>
                        ))}
                        {results.customers.slice(0, 2).map(customer => (
                          <div key={customer.id} className="p-3 border rounded-lg">
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                        ))}
                      </div>
                    ) : query && (
                      <p className="text-center text-muted-foreground py-4">No results found</p>
                    )}
                  </SheetContent>
                </Sheet>
              ) : (
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                    className="pl-9 w-64"
                  />
                </div>
              )}

              {/* Auto-Booking Sidebar Toggle */}
              <Button
                variant={autoBookingSidebarOpen ? "default" : "ghost"}
                size="sm"
                onClick={() => setAutoBookingSidebarOpen(!autoBookingSidebarOpen)}
                title="Toggle Auto-Booking"
                className="touch-manipulation min-h-[44px] min-w-[44px]"
              >
                <Zap className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative touch-manipulation min-h-[44px] min-w-[44px]">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h4 className="font-medium">Notifications</h4>
                  </div>
                  <Separator />
                  <div className="p-2">
                    <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                      <p className="text-sm font-medium">New booking received</p>
                      <p className="text-xs text-muted-foreground">John Smith - UA 457</p>
                    </div>
                    <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                      <p className="text-sm font-medium">Flight delayed</p>
                      <p className="text-xs text-muted-foreground">DL 892 - 30 min delay</p>
                    </div>
                    <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                      <p className="text-sm font-medium">Service completed</p>
                      <p className="text-xs text-muted-foreground">Sarah Johnson - Lounge access</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu - Avatar only on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full touch-manipulation min-h-[44px] min-w-[44px]">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{currentUser?.name ? currentUser.name.split(' ').map((n: string) => n[0]).slice(0,2).join('') : 'SM'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="p-3">
                    <div className="text-sm font-medium">{currentUser?.name || 'Not signed in'}</div>
                    <div className="text-xs text-muted-foreground">Role: {currentUser?.role || 'n/a'}</div>
                  </div>
                  <Separator />
                  <div className="p-2">
                    <div className="text-xs text-muted-foreground mb-2">Impersonate:</div>
                    <div className="max-h-40 overflow-auto">
                      {agents.map(a => (
                        <div key={a.id} className="py-1">
                          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => impersonate(a.id)}>{a.name} <span className="ml-2 text-xs text-muted-foreground">{a.role}</span></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex">
          <main className={`flex-1 p-4 sm:p-6 ${autoBookingSidebarOpen ? 'lg:mr-96' : ''}`}>
            {children}
          </main>

          {/* Auto-Booking Sidebar */}
          {autoBookingSidebarOpen && (
            <div className="fixed right-0 top-16 bottom-0 z-40">
              <AutoBookingSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
